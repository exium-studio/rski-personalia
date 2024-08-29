export default function isHasPermissions(
  userPermissions: number[] | undefined,
  permissionsNeeded: number[] | undefined
): boolean {
  if (
    !permissionsNeeded ||
    permissionsNeeded.length === 0 // Jika permissionsNeeded null, undefined, atau kosong
  ) {
    return true;
  }

  if (userPermissions && userPermissions.length > 0) {
    return (
      permissionsNeeded.every((permission) =>
        userPermissions.includes(permission)
      ) && permissionsNeeded.length === userPermissions.length
    );
  } else {
    return false; // Mengembalikan false jika userPermissions kosong atau undefined
  }
}
