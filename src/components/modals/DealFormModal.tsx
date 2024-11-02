import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/use-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { ContactDeal, Deal } from '../../types';

interface DealFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  companyName?: string;
}

const DEAL_STAGES = [
  'Lead',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

export default function DealFormModal({
  open,
  onOpenChange,
  contactId,
  contactName,
  companyName
}: DealFormModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    status: 'Lead',
    probability: '20',
    closingDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.accountId) return;

    try {
      setLoading(true);

      // Create the main deal in the deals collection
      const mainDealData: Partial<Deal> = {
        title: formData.title,
        value: parseFloat(formData.amount),
        stage: formData.status,
        probability: parseInt(formData.probability),
        expectedCloseDate: new Date(formData.closingDate),
        contactId,
        accountId: user.accountId,
        ownerId: user.id,
        ownerName: user.name,
        accountName: companyName || '',
        pipelineId: 'sales', // Default to sales pipeline
      };

      // Create in deals collection
      const dealRef = await addDoc(collection(db, 'deals'), {
        ...mainDealData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create in contactDeals collection
      const contactDealData: Partial<ContactDeal> = {
        contactId,
        accountId: user.accountId,
        title: formData.title,
        amount: parseFloat(formData.amount),
        status: formData.status,
        probability: parseInt(formData.probability),
        closingDate: new Date(formData.closingDate),
        dealId: dealRef.id, // Reference to the main deal
      };

      await addDoc(collection(db, 'contactDeals'), {
        ...contactDealData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast({
        title: "Success",
        description: "Deal created successfully",
      });

      onOpenChange(false);
      setFormData({
        title: '',
        amount: '',
        status: 'Lead',
        probability: '20',
        closingDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error",
        description: "Failed to create deal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Deal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Stage</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STAGES.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingDate">Expected Close Date</Label>
              <Input
                id="closingDate"
                type="date"
                value={formData.closingDate}
                onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{contactName}</p>
              {companyName && (
                <p className="text-gray-500">{companyName}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? 'Creating...' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}