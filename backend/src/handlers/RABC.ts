import { query } from "../database/query"

export const hasPermission = async (role: string, permission: string): Promise<boolean> => {
    try {
        const result = await query(
            `SELECT 1
             FROM RolePermissionsView
             WHERE RoleName = @RoleName AND PermissionName = @PermissionName`,
            { RoleName: role, PermissionName: permission }
        );

        // If the result has at least one row, permission is granted
        return result.length > 0;
    } catch (error) {
        console.error("[RBAC Error] ", error);
        throw error;
    }
};

