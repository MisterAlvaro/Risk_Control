'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  Save,
  AlertTriangle,
  Mail,
  Bell,
  Shield,
  UserX
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { riskRulesApi, actionsApi } from '@/lib/api/endpoints'
import { formatActionType } from '@/lib/utils/formatters'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { ApiStatus } from '@/components/shared/api-status'
import Link from 'next/link'

export default function RuleActionsPage() {
  const params = useParams()
  const router = useRouter()
  const ruleId = parseInt(params.id as string)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedAction, setSelectedAction] = useState<number | null>(null)

  // Fetch rule data
  const { data: ruleData, isLoading: isLoadingRule, error: ruleError, refetch: refetchRule } = useQuery({
    queryKey: ['rule', ruleId],
    queryFn: () => riskRulesApi.getById(ruleId),
    enabled: !!ruleId,
  })

  // Fetch available actions
  const { data: actionsData, isLoading: isLoadingActions } = useQuery({
    queryKey: ['actions'],
    queryFn: () => actionsApi.getAll({ is_active: true }),
  })

  const rule = ruleData?.data
  const actions = rule?.actions || []
  const availableActions = actionsData?.data || []

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Mutations
  const attachMutation = useMutation({
    mutationFn: (actionId: number) => 
      riskRulesApi.attachAction(ruleId, actionId),
    onSuccess: () => {
      refetchRule()
      setShowAddDialog(false)
    },
  })

  const detachMutation = useMutation({
    mutationFn: (actionId: number) => 
      riskRulesApi.detachAction(ruleId, actionId),
    onSuccess: () => {
      refetchRule()
      setSelectedAction(null)
    },
  })

  const updateOrderMutation = useMutation({
    mutationFn: (orderedActions: Array<{ id: number; order: number }>) =>
      riskRulesApi.updateActionsOrder(ruleId, orderedActions),
    onSuccess: () => {
      refetchRule()
    },
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = actions.findIndex((action) => action.id === active.id)
      const newIndex = actions.findIndex((action) => action.id === over.id)

      const newActions = arrayMove(actions, oldIndex, newIndex)
      const orderedActions = newActions.map((action: any, index: number) => ({
        id: action.id,
        order: index,
      }))

      updateOrderMutation.mutate(orderedActions)
    }
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'slack':
        return <Bell className="h-4 w-4" />
      case 'disable_trading':
        return <Shield className="h-4 w-4" />
      case 'disable_account':
        return <UserX className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getActionColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-600'
      case 'slack':
        return 'bg-purple-100 text-purple-600'
      case 'disable_trading':
        return 'bg-amber-100 text-amber-600'
      case 'disable_account':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  if (isLoadingRule) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (ruleError) {
    return (
      <ApiStatus
        isLoading={false}
        error={ruleError}
        refetch={refetchRule}
        errorMessage="Error al cargar la regla"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/rules/edit/${ruleId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Acciones de la Regla
            </h1>
            <p className="text-gray-600">
              {rule?.name} • Configure el orden de ejecución
            </p>
          </div>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Acción
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Total de Acciones"
          value={actions.length.toString()}
          description="Acciones configuradas"
        />
        <InfoCard
          title="Orden Actual"
          value={`${actions.length > 0 ? '1-' + actions.length : '0'}`}
          description="Secuencia de ejecución"
        />
        <InfoCard
          title="Estado"
          value={rule?.is_active ? 'Activa' : 'Inactiva'}
          description=""
          isActive={rule?.is_active}
        />
      </div>

      {/* Actions List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Arrastre y suelte para cambiar el orden de ejecución. Las acciones se ejecutarán en el orden mostrado.
            </p>

            {actions.length === 0 ? (
              <div className="py-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No hay acciones configuradas
                </h3>
                <p className="mt-2 text-gray-600">
                  Agregue acciones para que se ejecuten cuando se viole esta regla
                </p>
                <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primera Acción
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={actions.map(action => action.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {actions.map((action) => (
                      <SortableActionItem
                        key={action.id}
                        action={action}
                        onDelete={() => setSelectedAction(action.id)}
                        getIcon={getActionIcon}
                        getColor={getActionColor}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Order update status */}
            {updateOrderMutation.isPending && (
              <div className="flex items-center justify-center p-4">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-gray-600">Actualizando orden...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Action Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Acción</DialogTitle>
            <DialogDescription>
              Seleccione una acción para agregar a esta regla
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Select onValueChange={(value) => setSelectedAction(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una acción" />
              </SelectTrigger>
              <SelectContent>
                {availableActions
                  .filter(action => !actions.some(a => a.id === action.id))
                  .map((action) => (
                    <SelectItem key={action.id} value={action.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full p-1 ${getActionColor(action.type)}`}>
                          {getActionIcon(action.type)}
                        </div>
                        <div>
                          <div className="font-medium">{action.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatActionType(action.type)}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {availableActions.filter(action => !actions.some(a => a.id === action.id)).length === 0 && (
              <div className="rounded-lg bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">
                  No hay más acciones disponibles para agregar
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => selectedAction && attachMutation.mutate(selectedAction)}
              disabled={!selectedAction || attachMutation.isPending}
            >
              {attachMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Agregando...
                </>
              ) : (
                'Agregar Acción'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!selectedAction} onOpenChange={() => setSelectedAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Acción</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar esta acción de la regla?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedAction(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedAction && detachMutation.mutate(selectedAction)}
              disabled={detachMutation.isPending}
            >
              {detachMutation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Acción'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SortableActionItem({ 
  action, 
  onDelete,
  getIcon,
  getColor 
}: { 
  action: any
  onDelete: () => void
  getIcon: (type: string) => React.ReactNode
  getColor: (type: string) => string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: action.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-white p-4 ${
        isDragging ? 'shadow-lg border-primary' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </button>
          
          <div className={`rounded-full p-2 ${getColor(action.type)}`}>
            {getIcon(action.type)}
          </div>
          
          <div>
            <div className="font-medium">{action.name}</div>
            <div className="text-sm text-gray-500">
              {formatActionType(action.type)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-gray-50">
            Orden: {action.order !== undefined ? action.order + 1 : '-'}
          </Badge>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ 
  title, 
  value, 
  description,
  isActive = false 
}: { 
  title: string
  value: string
  description: string
  isActive?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`mt-2 text-3xl font-bold ${
          isActive ? 'text-green-600' : 'text-gray-900'
        }`}>
          {value}
        </p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
