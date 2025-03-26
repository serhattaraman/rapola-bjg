
import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { Plus, User, Shield, Users } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

const UserManagement = () => {
  const { currentUser, users, addUser } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'staff' as UserRole
  });

  // Redirect if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleAddUser = () => {
    // In a real application, you would have more validation and error handling
    addUser(newUser);
    toast({
      title: "Kullanıcı eklendi",
      description: `${newUser.name} başarıyla eklendi.`,
    });
    setOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'staff'
    });
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-500">Yönetici</Badge>;
      case 'staff':
        return <Badge className="bg-green-500">Personel</Badge>;
      default:
        return <Badge>Bilinmiyor</Badge>;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'manager':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'staff':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Kullanıcı Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
                <DialogDescription>
                  Sisteme yeni bir kullanıcı eklemek için aşağıdaki formu doldurun.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Ad Soyad
                  </label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right text-sm font-medium">
                    E-posta
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right text-sm font-medium">
                    Rol
                  </label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Yönetici</SelectItem>
                      <SelectItem value="staff">Personel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddUser}>Kullanıcı Ekle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">{user.name}</CardTitle>
                {getRoleBadge(user.role)}
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  {getRoleIcon(user.role)}
                  <span className="ml-2">{user.email}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
