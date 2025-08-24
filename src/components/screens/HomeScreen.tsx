'use client'

import { useRouter } from 'next/navigation'
import { User, Users, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBar } from '@/components/layout/StatusBar'

export function HomeScreen() {
  const router = useRouter()

  const menuItems = [
    {
      id: 'login',
      title: 'Login ArenaSobral',
      subtitle: 'Jogadores • Donos de Time • Areninhas',
      icon: User,
      bgColor: 'bg-blue-500',
      onClick: () => router.push('/login')
    },
    {
      id: 'searchteams',
      title: 'Buscar Times',
      subtitle: '',
      icon: Calendar,
      bgColor: 'bg-slate-600',
      onClick: () => router.push('/search/teams')
    },
    {
      id: 'searchplayers',
      title: 'Buscar Jogadores',
      subtitle: '',
      icon: Users,
      bgColor: 'bg-blue-500',
      onClick: () => router.push('/search/players')
    },
    {
      id: 'searchfields',
      title: 'Buscar Areninhas',
      subtitle: 'Encontre e reserve horários',
      icon: MapPin,
      bgColor: 'bg-green-600',
      onClick: () => router.push('/search/fields')
    },



    {
      id: 'fieldschedule',
      title: 'Gerenciar Horários',
      subtitle: 'Cadastrar horários das quadras',
      icon: Calendar,
      bgColor: 'bg-red-500',
      onClick: () => router.push('/field/schedule')
    }
  ]

  return (
    <div className="bg-slate-800 min-h-screen">
      <StatusBar />
      
      <div className="px-6 py-8">
        <h1 className="text-white text-4xl font-bold mb-8">ArenaSobral</h1>
        
        <div className="space-y-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            
            return (
              <Card key={item.id} className="card-hover">
                <Button
                  onClick={item.onClick}
                  variant="ghost"
                  className="w-full bg-white rounded-xl p-4 flex items-center gap-4 shadow-lg h-auto justify-start hover:bg-gray-50"
                >
                  <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  {item.subtitle ? (
                    <div className="flex-1 text-left">
                      <span className="text-lg font-medium text-slate-800 block">
                        {item.title}
                      </span>
                      <span className="text-sm text-slate-500">
                        {item.subtitle}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-medium text-slate-800">
                      {item.title}
                    </span>
                  )}
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}