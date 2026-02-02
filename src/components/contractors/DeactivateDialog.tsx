import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deactivationReasons } from "@/data/mock";

interface DeactivateDialogProps {
  open: boolean;
  contractorId: string | null;
  contractorName: string;
  onClose: () => void;
  onConfirm: (id: string, name: string, reasonId: string, notes?: string) => void;
}

export function DeactivateDialog({
  open,
  contractorId,
  contractorName,
  onClose,
  onConfirm,
}: DeactivateDialogProps) {
  const [reasonId, setReasonId] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    if (!contractorId || !reasonId) return;
    onConfirm(contractorId, contractorName, reasonId, notes || undefined);
    setReasonId("");
    setNotes("");
    onClose();
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setReasonId("");
      setNotes("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate contractor</DialogTitle>
          <DialogDescription>
            Offboard <strong>{contractorName}</strong>. Select a reason and optionally add notes.
            Site assignments and system access will be revoked.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Select value={reasonId} onValueChange={setReasonId} required>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select reason..." />
              </SelectTrigger>
              <SelectContent>
                {deactivationReasons.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reasonId}
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
