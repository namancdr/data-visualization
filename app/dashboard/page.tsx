"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Brush, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from "react-day-picker";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [ageGroup, setAgeGroup] = useState('all');
  const [gender, setGender] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchData();
  }, [ageGroup, gender, dateRange]);

  const fetchData = async () => {
    console.log({
      filters: {
        ageGroup,
        gender,
        startDate: dateRange.from,
        endDate: dateRange.to,
      }
    })
    setIsLoading(true);
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageGroup,
          gender,
          startDate: dateRange.from,
          endDate: dateRange.to
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareClick = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('ageGroup', ageGroup);
    url.searchParams.set('gender', gender);
    if (dateRange?.from) url.searchParams.set('startDate', dateRange.from.toISOString());
    if (dateRange?.to) url.searchParams.set('endDate', dateRange.to.toISOString());
    
    navigator.clipboard.writeText(url.toString());
    toast({
      title: 'URL Copied',
      description: 'The shareable URL has been copied to your clipboard.',
    });
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const prepareBarChartData = (data) => {
    const features = ['feature_a', 'feature_b', 'feature_c', 'feature_d', 'feature_e', 'feature_f'];
    return features.map(feature => ({
      name: feature.replace('feature_', '').toUpperCase(),
      value: data.reduce((sum, item) => sum + item[feature], 0)
    }));
  };

  const prepareLineChartData = (data, feature) => {
    return data.map(item => ({
      day: new Date(item.day).getTime(),
      value: item[feature]
    }));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Analytics Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <Select onValueChange={setAgeGroup} value={ageGroup}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Age Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="15-25">15-25</SelectItem>
            <SelectItem value=">25">25+</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setGender} value={gender}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
        <DatePickerWithRange setDateRange={setDateRange} />
        <Button onClick={handleShareClick}>Share View</Button>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Feature Usage Overview</h2>
        {isLoading ? (
          <div>Loading chart data...</div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={prepareBarChartData(data)}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" onClick={(entry) => setSelectedFeature(`feature_${entry.name.toLowerCase()}`)} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div>No data available</div>
        )}
      </div>
      {selectedFeature && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Time Trend for {selectedFeature.replace('feature_', '').toUpperCase()}</h2>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={prepareLineChartData(data, selectedFeature)}>
              <XAxis dataKey="day" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip labelFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} />
              <Legend />
              <Area dataKey="value" stroke="#8884d8" fill="none" />
              <Brush dataKey="day" height={30} stroke="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
