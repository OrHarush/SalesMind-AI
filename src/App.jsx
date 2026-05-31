import { useState } from 'react'
import Shell from './Shell'
import Dashboard from './pages/Dashboard'
import AllCalls from './pages/AllCalls'
import CallReview from './pages/CallReview'
import Progress from './pages/Progress'
import Achievements from './pages/Achievements'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [prevPage, setPrevPage] = useState('dashboard')
  const [timePeriod, setTimePeriod] = useState('week') // 'today' | 'week' | 'month'
  const [progressPeriod, setProgressPeriod] = useState('month') // 'month' | 'quarter' | 'year'

  // navigate while remembering where we came from (for the review "back" button)
  const go = (page) => {
    setPrevPage(activePage)
    setActivePage(page)
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':    return <Dashboard onViewCall={() => go('callReview')} onViewAll={() => go('calls')} timePeriod={timePeriod} />
      case 'calls':        return <AllCalls onOpenCall={() => go('callReview')} timePeriod={timePeriod} />
      case 'callReview':   return <CallReview onBack={() => setActivePage(prevPage)} />
      case 'progress':     return <Progress timePeriod={progressPeriod} />
      case 'achievements': return <Achievements />
      default:             return <Dashboard onViewCall={() => go('callReview')} onViewAll={() => go('calls')} timePeriod={timePeriod} />
    }
  }

  return (
    <Shell
      activePage={activePage}
      setActivePage={setActivePage}
      navigate={go}
      timePeriod={timePeriod}
      setTimePeriod={setTimePeriod}
      progressPeriod={progressPeriod}
      setProgressPeriod={setProgressPeriod}
    >
      {renderPage()}
    </Shell>
  )
}
