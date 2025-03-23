"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

interface FundProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  goal: number
  currentDonations?: number
  onDonate: (amount: number) => Promise<void>
}

export function FundProjectModal({
  isOpen,
  onClose,
  projectId,
  goal,
  currentDonations = 0,
  onDonate,
}: FundProjectModalProps) {
  const [amount, setAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDonate = async (amount: number) => {
    setIsLoading(true)
    try {
      await onDonate(amount)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate percentages based on goal and current donations
  const calculatePercentage = (amount: number) => {
    const total = currentDonations + amount
    return ((total / goal) * 100).toFixed(1)
  }

  // Calculate maximum amount that can be donated
  const maxDonation = goal - currentDonations

  // Check if a specific amount can be donated
  const canDonate = (amount: number) => {
    return currentDonations + amount <= goal
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = parseFloat(amount)

    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid amount greater than 0",
      })
      return
    }

    if (!canDonate(numericAmount)) {
      toast.error("Amount exceeds goal", {
        description: `Only ${maxDonation.toFixed(7)} XLM remaining to reach the goal`,
      })
      return
    }

    setIsLoading(true)
    try {
      await onDonate(numericAmount)
      onClose()
    } catch (error) {
      console.error("Error donating:", error)
      toast.error("Error processing donation", {
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Donate to Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-white/80">Amount to Donate (XLM)</Label>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                onClick={() => handleDonate(Math.min(goal * 0.1, maxDonation))}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                disabled={isLoading || !canDonate(goal * 0.1)}
              >
                <div className="text-center">
                  <div className="font-bold">10%</div>
                  <div className="text-sm opacity-80">
                    {calculatePercentage(goal * 0.1)}% of goal
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleDonate(Math.min(goal * 0.25, maxDonation))}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                disabled={isLoading || !canDonate(goal * 0.25)}
              >
                <div className="text-center">
                  <div className="font-bold">25%</div>
                  <div className="text-sm opacity-80">
                    {calculatePercentage(goal * 0.25)}% of goal
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleDonate(Math.min(goal * 0.5, maxDonation))}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                disabled={isLoading || !canDonate(goal * 0.5)}
              >
                <div className="text-center">
                  <div className="font-bold">50%</div>
                  <div className="text-sm opacity-80">
                    {calculatePercentage(goal * 0.5)}% of goal
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => handleDonate(maxDonation)}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                disabled={isLoading || maxDonation <= 0}
              >
                <div className="text-center">
                  <div className="font-bold">Complete</div>
                  <div className="text-sm opacity-80">
                    {maxDonation.toFixed(7)} XLM remaining
                  </div>
                </div>
              </Button>
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Maximum ${maxDonation.toFixed(7)} XLM`}
              className="bg-black/30 border-white/10 text-white"
              min="0"
              max={maxDonation}
              step="0.0000001"
            />
            <p className="text-sm text-white/70">
              Current donations: {currentDonations} XLM
            </p>
            <p className="text-sm text-white/70">
              Goal: {goal} XLM
            </p>
            <p className="text-sm text-white/70">
              Remaining: {maxDonation.toFixed(7)} XLM
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            disabled={isLoading || !canDonate(parseFloat(amount) || 0)}
          >
            {isLoading ? "Processing..." : "Donate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 