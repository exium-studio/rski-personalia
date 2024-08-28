export default function isHasSomePermissions(
  userPermissions: number[],
  permissionsNeeded: (number | null)[] | undefined
): boolean {
  if (permissionsNeeded && permissionsNeeded?.length > 0) {
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
