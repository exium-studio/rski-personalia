export default function isHasPermissions(
  userPermissions: number[],
  permissionsNeeded: number[] | undefined
): boolean {
  if (permissionsNeeded) {
    return permissionsNeeded.every((permission) =>
      userPermissions.includes(permission)
    );
  } else {
    return true;
  }
}
