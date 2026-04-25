/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useAuth } from './context/AuthContext';
import LoginView from './components/views/LoginView';

// --- Layout Components ---
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

// --- View Components ---
import DirectorView from './components/views/DirectorView';
import OperatorView from './components/views/OperatorView';
import StorekeeperView from './components/views/StorekeeperView';
import NutritionistView from './components/views/NutritionistView';
import ChefView from './components/views/ChefView';
import KitchenManagerView from './components/views/KitchenManagerView';
import LabView from './components/views/LabView';
import TeacherView from './components/views/TeacherView';
import NurseView from './components/views/NurseView';
import ParentView from './components/views/ParentView';
import InspectorView from './components/views/InspectorView';
import ProfilesView from './components/views/ProfilesView';
import SupplyView from './components/views/SupplyView';
import FinanceView from './components/views/FinanceView';

// --- Mock Data & Constants ---
import { 
  INITIAL_GROUPS, 
  INITIAL_KITCHEN_TASKS, 
  INITIAL_LAB_SAMPLES 
} from './constants/mockData';
import { UserRole, Group, KitchenTask, LabSample } from './types';
import { useGroups } from './features/groups/hooks/useGroups';

const App: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole>('PARENT');
  const { groups } = useGroups();

  useEffect(() => {
    if (user) {
      // Admin bo'lsa, automatik ravishda Operator sectioniga o'tkazamiz
      if (user.role === 'ADMIN') {
        setCurrentRole('OPERATOR');
      } else {
        setCurrentRole(user.role);
      }
    }
  }, [user]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderCurrentView = () => {
    switch (currentRole) {
      case 'DIRECTOR':
        return <DirectorView />;
      case 'ADMIN':
        // Admin uchun default ko'rinishni OperatorView qilamiz
        return <OperatorView groups={groups} />;
      case 'OPERATOR':
        return <OperatorView groups={groups} />;
      case 'STOREKEEPER':
        return <StorekeeperView />;
      case 'DIETITIAN':
        return <NutritionistView groups={groups} />;
      case 'KITCHEN_MANAGER':
        return <KitchenManagerView />;
      case 'CHEF':
        return <ChefView />;
      case 'LAB_CONTROLLER':
        return <LabView />;
      case 'TEACHER':
        return <TeacherView groups={groups} />;
      case 'NURSE':
        return <NurseView />;
      case 'PARENT':
        return <ParentView />;
      case 'INSPECTOR':
        return <InspectorView />;
      case 'PROFILES':
        return <ProfilesView />;
      case 'SUPPLY':
        return <SupplyView />;
      case 'FINANCE':
        return <FinanceView />;
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Ruxsat etilmagan</h1>
            <p className="text-brand-muted mt-2">Sizning rolingiz: {currentRole}</p>
          </div>
        );
    }
  };

  const isParent = currentRole === 'PARENT';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-brand-depth">
      {/* Sidebar - Hidden for Parents */}
      {!isParent && (
        <div className="w-72 hidden lg:block h-screen sticky top-0">
          <Sidebar activeRole={currentRole} onRoleChange={(role) => setCurrentRole(role as UserRole)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {!isParent && <TopBar role={currentRole} />}
        
        <main className={`flex-1 overflow-y-auto ${isParent ? 'p-0' : 'p-6 lg:p-10'}`}>
          <div className={`${isParent ? 'w-full' : 'max-w-[1600px] mx-auto'}`}>
            <AnimatePresence mode="wait">
              <div key={currentRole}>
                {renderCurrentView()}
              </div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
