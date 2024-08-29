export default function isHasSomePermissions(
  userPermissions: number[] | undefined,
  permissionsNeeded: (number | null)[] | undefined
): boolean {
  if (!permissionsNeeded) {
    return true; // Mengembalikan true jika permissionsNeeded undefined
  }

  if (permissionsNeeded.includes(null)) {
    return true; // Mengembalikan true jika permissionsNeeded mengandung null
  }

  if (userPermissions && userPermissions.length > 0) {
    // Mengecek apakah setidaknya satu permission ada di userPermissions
    return permissionsNeeded.some((permission) =>
      userPermissions.includes(permission as number)
    );
  } else {
    return false; // Mengembalikan false jika userPermissions kosong atau undefined
  }
}
