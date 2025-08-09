// Team collaboration service
export const TEAM_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  CREATE_FORMS: 'create_forms',
  EDIT_FORMS: 'edit_forms',
  DELETE_FORMS: 'delete_forms',
  VIEW_RESPONSES: 'view_responses',
  EXPORT_DATA: 'export_data',
  MANAGE_TEAM: 'manage_team',
  MANAGE_BILLING: 'manage_billing'
};

export const ROLE_PERMISSIONS = {
  [TEAM_ROLES.OWNER]: [
    PERMISSIONS.CREATE_FORMS,
    PERMISSIONS.EDIT_FORMS,
    PERMISSIONS.DELETE_FORMS,
    PERMISSIONS.VIEW_RESPONSES,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.MANAGE_BILLING
  ],
  [TEAM_ROLES.ADMIN]: [
    PERMISSIONS.CREATE_FORMS,
    PERMISSIONS.EDIT_FORMS,
    PERMISSIONS.DELETE_FORMS,
    PERMISSIONS.VIEW_RESPONSES,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.MANAGE_TEAM
  ],
  [TEAM_ROLES.EDITOR]: [
    PERMISSIONS.CREATE_FORMS,
    PERMISSIONS.EDIT_FORMS,
    PERMISSIONS.VIEW_RESPONSES,
    PERMISSIONS.EXPORT_DATA
  ],
  [TEAM_ROLES.VIEWER]: [
    PERMISSIONS.VIEW_RESPONSES
  ]
};

export const hasPermission = (userRole, permission) => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const inviteTeamMember = async (email, role, teamId) => {
  try {
    const response = await fetch('/api/team/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role, teamId })
    });

    if (!response.ok) {
      throw new Error('Failed to send invitation');
    }

    return await response.json();
  } catch (error) {
    console.error('Team invitation failed:', error);
    throw error;
  }
};

export const updateMemberRole = async (memberId, newRole) => {
  try {
    const response = await fetch('/api/team/update-role', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberId, role: newRole })
    });

    if (!response.ok) {
      throw new Error('Failed to update role');
    }

    return await response.json();
  } catch (error) {
    console.error('Role update failed:', error);
    throw error;
  }
};

export const removeMember = async (memberId) => {
  try {
    const response = await fetch('/api/team/remove-member', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberId })
    });

    if (!response.ok) {
      throw new Error('Failed to remove member');
    }

    return await response.json();
  } catch (error) {
    console.error('Member removal failed:', error);
    throw error;
  }
};