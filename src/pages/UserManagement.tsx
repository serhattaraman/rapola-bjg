
import React, { useState } from 'react';
import { useAuth, UserRole, StageKey } from '../context/AuthContext';
import { Plus, User, Shield, Users, Phone } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const allStages: StageKey[] = [
  "Başvuru Alındı",
  "Telefon Görüşmesi",
  "İK Görüşmesi",
  "Evrak Toplama",
  "Sisteme Evrak Girişi",
  "Sınıf Yerleştirme",
  "Denklik Süreci",
  "Vize Süreci",
  "Sertifika Süreci"
];

const UserManagement = () => {
  const { currentUser, users, addUser, updateUserStages } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff' as UserRole,
    authorizedStages: [] as StageKey[]
  });

  const [editStagesUserId, setEditStagesUserId] = useState<string | null>(null);
  const [editStages, setEditStages] = useState<StageKey[]>([]);

  // Redirect if not admin
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      toast({
        title: "Eksik bilgi",
        description: "Tüm alanları doldurun.",
        variant: "destructive"
      });
      return;
    }
    addUser(newUser);
    toast({
      title: "Kullanıcı eklendi",
      description: `${newUser.name} başarıyla eklendi.`,
    });
    setOpen(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'staff',
      authorizedStages: []
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

  // Edit stages authority
  const startEditStages = (userId: string, stages: StageKey[]) => {
    setEditStagesUserId(userId);
    setEditStages(stages);
  };
  const submitEditStages = () => {
    if (editStagesUserId) {
      updateUserStages(editStagesUserId, editStages);
      toast({
        title: "Yetkiler güncellendi",
        description: "Kullanıcı süreç yetkileri güncellendi."
      });
      setEditStagesUserId(null);
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
                  <Label htmlFor="name" className="text-right text-sm font-medium">
                    Ad Soyad
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right text-sm font-medium">
                    E-posta
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right text-sm font-medium flex items-center gap-1">
                    <Phone className="w-4 h-4" /> Telefon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    className="col-span-3"
                    placeholder="5XX1234567"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right text-sm font-medium">
                    Rol
                  </Label>
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
                {/* Süreç yetkisi seçimi */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right text-sm font-medium pt-2">
                    Süreç Yetkileri
                  </Label>
                  <div className="col-span-3 flex flex-col gap-1">
                    {allStages.map(stage => (
                      <label key={stage} className="flex items-center gap-2">
                        <Checkbox
                          checked={newUser.authorizedStages.includes(stage)}
                          onCheckedChange={(checked) => {
                            setNewUser(prev => checked
                              ? { ...prev, authorizedStages: [...prev.authorizedStages, stage] }
                              : { ...prev, authorizedStages: prev.authorizedStages.filter(s => s !== stage) }
                            );
                          }}
                        />
                        <span>{stage}</span>
                      </label>
                    ))}
                  </div>
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
                <div className="flex gap-2">
                  {getRoleBadge(user.role)}
                  {/* Admin yetkilendirme butonu */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditStages(user.id, user.authorizedStages || [])}
                  >
                    Yetki Düzenle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600 mt-1 gap-2">
                  {getRoleIcon(user.role)}
                  <span className="ml-2">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1 gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="ml-2">{user.phone || '-'}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  <span className="font-medium text-gray-800">Yetkili olduğu süreçler:</span>
                  {(user.authorizedStages || []).length === 0 
                    ? <span className="italic text-gray-400">Yok</span>
                    : user.authorizedStages?.map(s => <Badge key={s} className="bg-indigo-400">{s}</Badge>)
                  }
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Yetki düzenleme dialog */}
      <Dialog open={!!editStagesUserId} onOpenChange={() => setEditStagesUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Süreç Yetkileri</DialogTitle>
            <DialogDescription>
              Kullanıcının hangi aday süreçlerinde işlem yapabileceğini seçin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-2">
            {allStages.map(stage => (
              <label key={stage} className="flex items-center gap-2">
                <Checkbox
                  checked={editStages.includes(stage)}
                  onCheckedChange={(checked) => {
                    setEditStages(prev =>
                      checked ? [...prev, stage] : prev.filter(s => s !== stage)
                    );
                  }}
                />
                <span>{stage}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="default" onClick={submitEditStages}>
              Kaydet
            </Button>
            <Button variant="outline" onClick={() => setEditStagesUserId(null)}>
              İptal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;

