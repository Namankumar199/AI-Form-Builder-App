"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Crown, Shield, Edit, Eye, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TEAM_ROLES, hasPermission, PERMISSIONS, inviteTeamMember, updateMemberRole, removeMember } from '@/lib/teamService';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading';
import { db } from '@/configs';
import { TeamMembers } from '@/configs/schema';

function TeamManagement({ currentUser, userRole = TEAM_ROLES.OWNER }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(TEAM_ROLES.EDITOR);
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, [currentUser]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team/members');
      const data = await response.json();
      
      if (data.success) {
        // Add owner as first member if not in database
        const members = data.members || [];
        const ownerExists = members.find(m => m.userEmail === currentUser?.primaryEmailAddress?.emailAddress);
        
        if (!ownerExists && currentUser?.primaryEmailAddress?.emailAddress) {
          members.unshift({
            id: 0,
            userEmail: currentUser.primaryEmailAddress.emailAddress,
            role: TEAM_ROLES.OWNER,
            status: 'active',
            joinedAt: '2024-01-01'
          });
        }
        
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case TEAM_ROLES.OWNER: return <Crown className="h-4 w-4 text-yellow-500" />;
      case TEAM_ROLES.ADMIN: return <Shield className="h-4 w-4 text-red-500" />;
      case TEAM_ROLES.EDITOR: return <Edit className="h-4 w-4 text-blue-500" />;
      case TEAM_ROLES.VIEWER: return <Eye className="h-4 w-4 text-gray-500" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case TEAM_ROLES.OWNER: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case TEAM_ROLES.ADMIN: return 'bg-red-100 text-red-800 border-red-300';
      case TEAM_ROLES.EDITOR: return 'bg-blue-100 text-blue-800 border-blue-300';
      case TEAM_ROLES.VIEWER: return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !inviteRole) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!hasPermission(userRole, PERMISSIONS.MANAGE_TEAM)) {
      toast.error('You do not have permission to invite members');
      return;
    }

    setIsInviting(true);
    
    try {
      const result = await inviteTeamMember(inviteEmail, inviteRole, 'team-1');
      
      if (result.success) {
        const newMember = {
          id: Date.now(),
          email: inviteEmail,
          role: inviteRole,
          status: 'pending',
          invitedAt: new Date().toISOString().split('T')[0]
        };

        // Refresh team members list
        fetchTeamMembers();
        setInviteEmail('');
        setInviteRole(TEAM_ROLES.EDITOR);
        setShowInviteDialog(false);
        
        toast.success(`Invitation sent to ${inviteEmail}`);
      } else {
        toast.error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Invitation error:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    if (!hasPermission(userRole, PERMISSIONS.MANAGE_TEAM)) {
      toast.error('You do not have permission to change roles');
      return;
    }

    try {
      setTeamMembers(prev => 
        prev.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        )
      );
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!hasPermission(userRole, PERMISSIONS.MANAGE_TEAM)) {
      toast.error('You do not have permission to remove members');
      return;
    }

    try {
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Team Management
          </CardTitle>
          <CardDescription>
            Manage your team members and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{teamMembers.length}</div>
                <div className="text-sm text-gray-600">Total Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {teamMembers.filter(m => m.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {teamMembers.filter(m => m.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>

            {hasPermission(userRole, PERMISSIONS.MANAGE_TEAM) && (
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your team
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <Input
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Role</label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TEAM_ROLES.ADMIN}>Admin</SelectItem>
                          <SelectItem value={TEAM_ROLES.EDITOR}>Editor</SelectItem>
                          <SelectItem value={TEAM_ROLES.VIEWER}>Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      onClick={handleInviteMember}
                      disabled={isInviting}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      {isInviting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Sending Invitation...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Members List */}
      <Card className="border-2 border-gray-200">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-medium">
                    {(member.userEmail || member.email || '').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{member.userEmail || member.email}</div>
                    <div className="text-sm text-gray-600">
                      {member.status === 'active' ? 'Joined' : 'Invited'} {member.joinedAt || member.invitedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={`flex items-center gap-1 ${getRoleBadgeColor(member.role)}`}>
                    {getRoleIcon(member.role)}
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>

                  {member.status === 'pending' && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                      Pending
                    </Badge>
                  )}

                  {hasPermission(userRole, PERMISSIONS.MANAGE_TEAM) && member.role !== TEAM_ROLES.OWNER && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(newRole) => handleRoleChange(member.id, newRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={TEAM_ROLES.ADMIN}>Admin</SelectItem>
                          <SelectItem value={TEAM_ROLES.EDITOR}>Editor</SelectItem>
                          <SelectItem value={TEAM_ROLES.VIEWER}>Viewer</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TeamManagement;