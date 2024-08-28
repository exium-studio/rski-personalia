export default function isHasPermissions(
  userPermissions: number[],
  permissionsNeeded: number[] | undefined
): boolean {
  if (permissionsNeeded && permissionsNeeded?.length > 0) {
    return permissionsNeeded.every((permission) =>
      userPermissions.includes(permission)
    );
  } else {
    return true;
  }
}
