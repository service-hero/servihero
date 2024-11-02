import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Brain, 
  Sparkles,
  Settings,
  Filter,
  Search,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/toaster';
import DealColumn from '../components/deals/DealColumn';
import PipelineSettingsModal from '../components/modals/PipelineSettingsModal';
import DealModal from '../components/modals/DealModal';
import CustomizeDealModal from '../components/modals/CustomizeDealModal';
import PipelineSelect from '../components/deals/PipelineSelect';
import { Button } from '../components/ui/button';
import { DealService } from '../services/firestore/DealService';
import { PipelineConfigService } from '../services/firestore/PipelineConfigService';
import type { Deal } from '../types';
import type { PipelineConfig } from '../services/firestore/PipelineConfigService';

const PIPELINE_STAGES = {
  sales: [
    'Lead',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost',
  ],
  service: [
    'New Request',
    'In Progress',
    'Under Review',
    'Completed',
    'Cancelled'
  ]
};

const INITIAL_PIPELINES = [
  { id: 'sales', name: 'Sales Pipeline' },
  { id: 'service', name: 'Service Pipeline' }
];

const DEFAULT_CONFIG: Omit<PipelineConfig, 'id' | 'accountId' | 'pipelineId'> = {
  name: 'Default Configuration',
  layout: 'default',
  visibleFields: ['value', 'probability', 'dates', 'owner', 'company'],
  showProgress: true,
  showProbability: true,
  showValue: true,
  showDates: true,
  showOwner: true,
  showCompany: true
};

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showPipelineSettings, setShowPipelineSettings] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedPipeline, setSelectedPipeline] = useState('sales');
  const [pipelines] = useState(INITIAL_PIPELINES);
  const [loading, setLoading] = useState(true);
  const [pipelineConfig, setPipelineConfig] = useState<PipelineConfig | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load pipeline configuration
  useEffect(() => {
    if (!user?.accountId) return;

    const loadPipelineConfig = async () => {
      try {
        const config = await PipelineConfigService.getConfig(user.accountId, selectedPipeline);
        if (config) {
          setPipelineConfig(config);
        } else {
          // Create default config if none exists
          const newConfig = await PipelineConfigService.saveConfig({
            ...DEFAULT_CONFIG,
            accountId: user.accountId,
            pipelineId: selectedPipeline,
          });
          setPipelineConfig(newConfig);
        }
      } catch (error) {
        console.error('Error loading pipeline config:', error);
        toast({
          title: "Error",
          description: "Failed to load pipeline configuration",
          variant: "destructive",
        });
      }
    };

    loadPipelineConfig();
  }, [user?.accountId, selectedPipeline, toast]);

  // Load deals
  useEffect(() => {
    if (!user?.accountId) return;

    const q = query(
      collection(db, 'deals'),
      where('accountId', '==', user.accountId),
      where('pipelineId', '==', selectedPipeline)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const loadedDeals = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          expectedCloseDate: doc.data().expectedCloseDate?.toDate()
        })) as Deal[];
        setDeals(loadedDeals);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading deals:', error);
        toast({
          title: "Error loading deals",
          description: "Failed to load deals. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.accountId, selectedPipeline, toast]);

  const filteredDeals = deals.filter(deal => deal.pipelineId === selectedPipeline);
  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedValue = filteredDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  const handleDrop = async (dealId: string, newStage: string) => {
    if (!user?.accountId) return;

    try {
      const dealRef = doc(db, 'deals', dealId);
      await updateDoc(dealRef, {
        stage: newStage,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Deal updated",
        description: "Deal stage has been successfully updated",
        variant: "success",
      });
    } catch (error) {
      console.error('Error updating deal stage:', error);
      toast({
        title: "Error updating deal",
        description: "Failed to update deal stage. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDealModal(true);
  };

  const handlePipelineChange = (pipelineId: string) => {
    setSelectedPipeline(pipelineId);
  };

  const handleCreateDeal = async (data: Partial<Deal>) => {
    if (!user?.accountId) return;

    try {
      const newDeal = {
        ...data,
        accountId: user.accountId,
        pipelineId: selectedPipeline,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expectedCloseDate: data.expectedCloseDate || new Date(),
        ownerId: user.id,
        ownerName: user.name
      };

      await addDoc(collection(db, 'deals'), newDeal);

      toast({
        title: "Deal created",
        description: "New deal has been successfully created",
        variant: "success",
      });
      setShowDealModal(false);
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error creating deal",
        description: "Failed to create deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDeal = async (data: Partial<Deal>) => {
    if (!selectedDeal?.id) return;

    try {
      const dealRef = doc(db, 'deals', selectedDeal.id);
      await updateDoc(dealRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Deal updated",
        description: "Deal has been successfully updated",
        variant: "success",
      });
      setShowDealModal(false);
    } catch (error) {
      console.error('Error updating deal:', error);
      toast({
        title: "Error updating deal",
        description: "Failed to update deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!user?.accountId || !user?.role) return;

    try {
      await DealService.delete(dealId, user.accountId, user.role);

      toast({
        title: "Success",
        description: "Deal deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast({
        title: "Error",
        description: error.code === 'permission-denied' 
          ? "You don't have permission to delete this deal"
          : "Failed to delete deal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePipelineConfig = async (config: Partial<PipelineConfig>) => {
    if (!user?.accountId || !pipelineConfig) return;

    try {
      const updatedConfig = await PipelineConfigService.saveConfig({
        ...pipelineConfig,
        ...config,
        accountId: user.accountId,
        pipelineId: selectedPipeline
      });

      setPipelineConfig(updatedConfig);
      setShowCustomizeModal(false);

      toast({
        title: "Success",
        description: "Pipeline configuration updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating pipeline config:', error);
      toast({
        title: "Error",
        description: "Failed to update pipeline configuration",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pipeline</h1>
            <div className="mt-1 text-sm text-gray-500">
              <span className="mr-4">Total Value: ${totalValue.toLocaleString()}</span>
              <span>Weighted Value: ${weightedValue.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <PipelineSelect
              selectedPipeline={selectedPipeline}
              pipelines={pipelines}
              onPipelineChange={handlePipelineChange}
              onOpenSettings={() => setShowPipelineSettings(true)}
            />
            <Button
              onClick={() => {
                setSelectedDeal(null);
                setShowDealModal(true);
              }}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>

        {/* Pipeline Columns */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES[selectedPipeline as keyof typeof PIPELINE_STAGES]?.map((stage) => (
            <DealColumn
              key={stage}
              stage={stage}
              deals={filteredDeals.filter(deal => deal.stage === stage)}
              onDrop={handleDrop}
              onDealClick={handleDealClick}
              onCustomize={() => setShowCustomizeModal(true)}
              onDeleteDeal={handleDeleteDeal}
              preferences={pipelineConfig || DEFAULT_CONFIG}
            />
          ))}
        </div>

        <PipelineSettingsModal
          open={showPipelineSettings}
          onOpenChange={setShowPipelineSettings}
          onPipelineCreate={(newPipeline) => {
            setSelectedPipeline(newPipeline.id);
          }}
        />

        <DealModal
          open={showDealModal}
          onOpenChange={setShowDealModal}
          mode={selectedDeal ? 'edit' : 'create'}
          initialData={selectedDeal || undefined}
          onSubmit={selectedDeal ? handleUpdateDeal : handleCreateDeal}
        />

        <CustomizeDealModal
          open={showCustomizeModal}
          onOpenChange={setShowCustomizeModal}
          onSave={handleUpdatePipelineConfig}
          currentPreferences={pipelineConfig || DEFAULT_CONFIG}
          sampleDeal={deals[0] || {
            id: '1',
            title: 'Sample Deal',
            value: 50000,
            stage: 'Qualified',
            probability: 60,
            expectedCloseDate: new Date(),
            contactId: '1',
            accountId: '1',
            ownerId: '1',
            accountName: 'Sample Company',
            ownerName: 'John Smith',
            createdAt: new Date(),
            updatedAt: new Date(),
            pipelineId: 'sales'
          }}
        />
      </div>
    </div>
  );
}