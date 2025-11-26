import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  variant = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={variant === "destructive" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Hook for easier usage
export function useConfirm() {
  const [confirmState, setConfirmState] = React.useState<{
    open: boolean
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
    onConfirm: () => void
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const confirm = React.useCallback(
    (options: {
      title: string
      description: string
      confirmText?: string
      cancelText?: string
      variant?: "default" | "destructive"
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmState({
          open: true,
          title: options.title,
          description: options.description,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          variant: options.variant,
          onConfirm: () => resolve(true),
        })
      })
    },
    []
  )

  const ConfirmDialogComponent = React.useCallback(() => {
    return (
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmState(prev => ({ ...prev, open: false }))
          }
        }}
        title={confirmState.title}
        description={confirmState.description}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        onConfirm={confirmState.onConfirm}
      />
    )
  }, [confirmState])

  return { confirm, ConfirmDialog: ConfirmDialogComponent }
}