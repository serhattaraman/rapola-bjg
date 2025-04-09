import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, User, ListChecks, FileText, Users } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for user reports
const mockUserReports = [
  {
    userId: '1',
    userName: 'Hatice Yıldırım',
    userRole: 'İK Uzmanı',
    processes: {
      total: 120,
      pending: 30,
      completed: 90,
    },
    performance: {
      averageDuration: '3 gün',
      successRate: '75%',
    },
  },
  {
    userId: '2',
    userName: 'İmre Özerim',
    userRole: 'İK Uzmanı',
    processes: {
      total: 150,
      pending: 25,
      completed: 125,
    },
    performance: {
      averageDuration: '2 gün',
      successRate: '83%',
    },
  },
  {
    userId: '3',
    userName: 'Ahmet Demir',
    userRole: 'İK Uzmanı',
    processes: {
      total: 90,
      pending: 15,
      completed: 75,
    },
    performance: {
      averageDuration: '4 gün',
      successRate: '68%',
    },
  },
  {
    userId: '4',
    userName: 'Ayşe Kaya',
    userRole: 'İK Uzmanı',
    processes: {
      total: 180,
      pending: 35,
      completed: 145,
    },
    performance: {
      averageDuration: '2.5 gün',
      successRate: '79%',
    },
  },
  {
    userId: '5',
    userName: 'Mehmet Şahin',
    userRole: 'İK Uzmanı',
    processes: {
      total: 110,
      pending: 20,
      completed: 90,
    },
    performance: {
      averageDuration: '3.5 gün',
      successRate: '72%',
    },
  },
];

const UserReports = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedReportType, setSelectedReportType] = useState('detailed'); // 'summary' | 'detailed'
  const [userData, setUserData] = useState(mockUserReports);

  useEffect(() => {
    // In a real application, you would fetch data from an API here
    // using the selectedDate and other filters.
    // For now, we'll use the mock data.
    setUserData(mockUserReports);
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Kullanıcı Raporları</h1>
            <p className="text-gray-500 mt-1">İK uzmanlarının performansını görüntüleyin</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "dd.MM.yyyy")
                  ) : (
                    <span>Tarih Seç</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date('2023-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Rapor Tipi Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Özet Rapor</SelectItem>
                <SelectItem value="detailed">Detaylı Rapor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedReportType === 'summary' ? (
          // Summary Report
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.map((user) => (
              <Card key={user.userId} className="animate-scale-in">
                <CardHeader>
                  <CardTitle>{user.userName}</CardTitle>
                  <CardDescription>{user.userRole}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Toplam Aday:</span>
                    <span className="ml-auto font-medium">{user.processes?.total || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <ListChecks className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Tamamlanan:</span>
                    <span className="ml-auto font-medium">{user.processes?.completed || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Ortalama Süre:</span>
                    <span className="ml-auto font-medium">{user.performance?.averageDuration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Başarı Oranı:</span>
                    <span className="ml-auto font-medium">{user.performance?.successRate || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Detailed Report
          <div className="animate-scale-in">
            <Table>
              <TableCaption>İK Uzmanlarının detaylı raporu</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Kullanıcı Adı</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-center">Toplam İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.userRole}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {user.processes?.total || 0}
                    </td>
                  </tr>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Toplam</TableCell>
                  <TableCell className="text-center">
                    {userData.reduce((acc, user) => acc + (user.processes?.total || 0), 0)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}

        {/* Mobile View */}
        <div className="block md:hidden mt-8">
          <h2 className="text-xl font-semibold mb-4">İK Uzmanı Performansı</h2>
          <div className="space-y-4">
            {userData.map((user) => (
              <div key={user.userId} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-sm font-medium">{user.userName}</p>
                    <p className="text-xs text-gray-500">{user.userRole}</p>
                  </div>
                  <div className="text-xs font-semibold mt-1 sm:mt-0">
                    {user.processes?.total || 0} işlem
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <ListChecks className="h-3 w-3 mr-1" />
                    <span>Tamamlanan: {user.processes?.completed || 0}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <FileText className="h-3 w-3 mr-1" />
                    <span>Ort. Süre: {user.performance?.averageDuration || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <BarChart className="h-3 w-3 mr-1" />
                    <span>Başarı: {user.performance?.successRate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReports;
