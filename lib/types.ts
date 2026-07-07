/**
 * Tipos para o formato de exportação de dados do Instagram (categoria "Conexões",
 * formato JSON). A Meta já alterou esse schema no passado, então os campos opcionais
 * abaixo refletem variações observadas na prática — o parser deve validar antes de usar.
 */

/** Um item de `string_list_data`. Em `following.json` não há campo `value` (o
 * username vem em `title`); em `followers_*.json` o `value` já é o username. */
export interface InstagramStringListEntry {
  href?: string;
  value?: string;
  timestamp?: number;
}

/** Formato comum a uma entrada de relacionamento (following ou follower). */
export interface InstagramRelationshipEntry {
  title?: string;
  media_list_data?: unknown[];
  string_list_data?: InstagramStringListEntry[];
}

/** `connections/followers_and_following/following.json` */
export interface InstagramFollowingFile {
  relationships_following: InstagramRelationshipEntry[];
}

/** `connections/followers_and_following/followers_<n>.json` — array na raiz. */
export type InstagramFollowersFile = InstagramRelationshipEntry[];

/** Perfil normalizado, já com o username extraído de forma resiliente. */
export interface InstagramProfile {
  username: string;
  href: string | null;
  timestamp: number | null;
}

/** Perfil sem par na outra lista, com um palpite opcional de que pode ser a mesma
 * pessoa sob um @ diferente (o export da Meta não traz um ID estável de conta, então
 * isso nunca é uma certeza — só uma pista por similaridade de username). */
export interface ProfileWithRenameHint extends InstagramProfile {
  possibleRename: InstagramProfile | null;
}

/** Resultado da comparação entre following e followers. */
export interface ComparisonResult {
  /** following - followers: você segue, mas não é seguido de volta. */
  notFollowingBack: ProfileWithRenameHint[];
  /** followers - following: te seguem, mas você não segue de volta. */
  youDontFollowBack: ProfileWithRenameHint[];
  /** following ∩ followers: seguem um ao outro. */
  mutual: ProfileWithRenameHint[];
  totalFollowing: number;
  totalFollowers: number;
}

export type ParseErrorCode =
  | "invalid_zip"
  | "missing_following_file"
  | "missing_followers_file"
  | "invalid_json"
  | "unexpected_schema"
  | "too_many_profiles";

export class InstagramExportParseError extends Error {
  code: ParseErrorCode;

  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.name = "InstagramExportParseError";
    this.code = code;
  }
}
