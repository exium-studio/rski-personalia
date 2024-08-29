export default function isHasSomePermissions(
  userPermissions: number[] | undefined,
  permissionsNeeded: (number | null)[] | undefined
): boolean {
  if (
    userPermissions &&
    userPermissions.length > 0 &&
    permissionsNeeded &&
    permissionsNeeded?.length > 0
  ) {
    return permissionsNeeded.some((permission) => {
      if (permission !== null) {
        return userPermissions.includes(permission);
      } else {
        return true;
      }
    });
  } else {
    return true;
  }
}
