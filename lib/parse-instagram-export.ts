import JSZip from "jszip";
import {
  InstagramExportParseError,
  type InstagramFollowersFile,
  type InstagramFollowingFile,
  type InstagramProfile,
  type InstagramRelationshipEntry,
} from "@/lib/types";

const FOLLOWING_PATH = "connections/followers_and_following/following.json";
// A Meta pagina os seguidores em followers_1.json, followers_2.json, ... quando a
// lista é grande, então não podemos assumir que só existe followers_1.json.
const FOLLOWERS_FILE_PATTERN = /^connections\/followers_and_following\/followers_\d+\.json$/;

// Limite defensivo contra zips corrompidos/maliciosos. Bem acima do que a spec pede
// suportar (~5.000 perfis com boa performance).
const MAX_PROFILES = 50_000;

// Quando uma conta é excluída, a Meta não remove a entrada do histórico — ela troca o
// username por um placeholder desse formato. Não é uma pessoa real, então descartamos.
const DELETED_ACCOUNT_PATTERN = /^__deleted__/i;

function extractUsername(entry: InstagramRelationshipEntry): string | null {
  const listEntry = entry.string_list_data?.[0];

  if (listEntry?.value) return listEntry.value;
  if (entry.title) return entry.title;

  // following.json não tem `value`, só um `href` como .../instagram.com/_u/username
  if (listEntry?.href) {
    const match = listEntry.href.match(/instagram\.com\/(?:_u\/)?([^/?]+)/);
    if (match) return match[1];
  }

  return null;
}

function normalizeEntry(entry: InstagramRelationshipEntry): InstagramProfile | null {
  const username = extractUsername(entry);
  if (!username || DELETED_ACCOUNT_PATTERN.test(username)) return null;

  const listEntry = entry.string_list_data?.[0];
  return {
    username,
    // Construímos a URL canônica em vez de usar a `href` bruta: following.json guarda um
    // formato interno (.../_u/username) que não é mais confiável quando a pessoa troca de
    // @ depois que você passou a segui-la.
    href: `https://www.instagram.com/${username}/`,
    timestamp: listEntry?.timestamp ?? null,
  };
}

async function readJsonFromZip<T>(zipObject: JSZip.JSZipObject): Promise<T> {
  const text = await zipObject.async("string");
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new InstagramExportParseError(
      "invalid_json",
      "Não conseguimos ler um dos arquivos JSON dentro do zip. O arquivo pode estar corrompido.",
    );
  }
}

export interface ParsedInstagramExport {
  following: InstagramProfile[];
  followers: InstagramProfile[];
}

export async function parseInstagramExportZip(file: File | Blob): Promise<ParsedInstagramExport> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new InstagramExportParseError(
      "invalid_zip",
      "O arquivo enviado não é um .zip válido ou está corrompido.",
    );
  }

  const followingZipObject = zip.file(FOLLOWING_PATH);
  if (!followingZipObject) {
    throw new InstagramExportParseError(
      "missing_following_file",
      'Não encontramos o arquivo "following.json" dentro do zip. Confirme se você exportou a categoria "Conexões" no formato JSON.',
    );
  }

  const followersZipObjects = zip.file(FOLLOWERS_FILE_PATTERN);
  if (followersZipObjects.length === 0) {
    throw new InstagramExportParseError(
      "missing_followers_file",
      'Não encontramos nenhum arquivo "followers_*.json" dentro do zip. Confirme se você exportou a categoria "Conexões" no formato JSON.',
    );
  }

  const followingJson = await readJsonFromZip<InstagramFollowingFile>(followingZipObject);
  if (!Array.isArray(followingJson?.relationships_following)) {
    throw new InstagramExportParseError(
      "unexpected_schema",
      'O arquivo "following.json" não tem o formato esperado. É possível que a Meta tenha mudado o formato de exportação.',
    );
  }

  const followersJsonLists = await Promise.all(
    followersZipObjects.map((zipObject) => readJsonFromZip<InstagramFollowersFile>(zipObject)),
  );
  for (const list of followersJsonLists) {
    if (!Array.isArray(list)) {
      throw new InstagramExportParseError(
        "unexpected_schema",
        'Um dos arquivos "followers_*.json" não tem o formato esperado. É possível que a Meta tenha mudado o formato de exportação.',
      );
    }
  }

  const following = followingJson.relationships_following
    .map(normalizeEntry)
    .filter((profile): profile is InstagramProfile => profile !== null);

  const followers = followersJsonLists
    .flat()
    .map(normalizeEntry)
    .filter((profile): profile is InstagramProfile => profile !== null);

  if (following.length + followers.length > MAX_PROFILES) {
    throw new InstagramExportParseError(
      "too_many_profiles",
      `Esse arquivo tem mais perfis do que conseguimos processar com segurança no navegador (limite: ${MAX_PROFILES.toLocaleString("pt-BR")}).`,
    );
  }

  return { following, followers };
}
