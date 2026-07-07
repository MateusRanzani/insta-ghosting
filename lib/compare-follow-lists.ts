import { findPossibleRenameMatches } from "@/lib/username-similarity";
import type { ComparisonResult, InstagramProfile, ProfileWithRenameHint } from "@/lib/types";

function byUsername(a: InstagramProfile, b: InstagramProfile): number {
  return a.username.localeCompare(b.username, "pt-BR", { sensitivity: "base" });
}

function withRenameHints(
  orphans: InstagramProfile[],
  candidates: InstagramProfile[],
): ProfileWithRenameHint[] {
  const renameMatches = findPossibleRenameMatches(orphans, candidates);
  return orphans.map((profile) => ({
    ...profile,
    possibleRename: renameMatches.get(profile.username.toLowerCase()) ?? null,
  }));
}

export function compareFollowLists(
  following: InstagramProfile[],
  followers: InstagramProfile[],
): ComparisonResult {
  const followerUsernames = new Set(followers.map((p) => p.username.toLowerCase()));
  const followingUsernames = new Set(following.map((p) => p.username.toLowerCase()));

  const notFollowingBack = following
    .filter((p) => !followerUsernames.has(p.username.toLowerCase()))
    .sort(byUsername);

  const youDontFollowBack = followers
    .filter((p) => !followingUsernames.has(p.username.toLowerCase()))
    .sort(byUsername);

  const mutual = following
    .filter((p) => followerUsernames.has(p.username.toLowerCase()))
    .sort(byUsername)
    .map((profile) => ({ ...profile, possibleRename: null }));

  return {
    notFollowingBack: withRenameHints(notFollowingBack, followers),
    youDontFollowBack: withRenameHints(youDontFollowBack, following),
    mutual,
    totalFollowing: following.length,
    totalFollowers: followers.length,
  };
}
