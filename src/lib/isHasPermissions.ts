export default function isHasPermissions(
  userPermissions: number[] | undefined,
  permissionsNeeded: number[] | undefined
): boolean {
  if (!permissionsNeeded || permissionsNeeded.length === 0) {
    return true;
  }

  if (userPermissions && userPermissions.length > 0) {
    return permissionsNeeded.every((permission) =>
      userPermissions.includes(permission)
    );
  } else {
    return false;
  }
}
