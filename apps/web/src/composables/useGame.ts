import { ref, computed, onUnmounted, type Ref } from 'vue'
import { getGameStateProvider, initializeGame, getExtendedBuildings, getExtendedPopulations, getBuildingName, type GameAlert, type ExtendedBuilding, type ExtendedPopulation } from '../state/gameState'
import { setPause, setResume, tickTime, addNotification, createBuilding as createBuildingAction, removeBuilding as removeBuildingAction, setProductionMethod, setWorkers, setResourceMoney, setGoodsQuantity } from '@webvic3/core'
import type { GameState, BuildingType, GameDate, Era } from '@webvic3/core'

const provider = getGameStateProvider()

let _globalTickInterval: number | null = null
let _tickerCount = 0

export function useGame() {
  _tickerCount++
  const state: Ref<GameState | null> = ref(null)
  const buildings = ref<ExtendedBuilding[]>([])
  const populations = ref<ExtendedPopulation[]>([])
  const alerts = ref<GameAlert[]>([])
  const isInitialized = ref(false)

  const unsubscribe = provider.subscribe(() => {
    try {
      state.value = provider.getState()
      if (state.value) {
        buildings.value = getExtendedBuildings(state.value)
        populations.value = getExtendedPopulations(state.value)
        alerts.value = state.value.notifications.map(n => ({
          id: n.id,
          type: n.type as GameAlert['type'],
          title: n.title,
          message: n.message,
          timestamp: n.timestamp
        }))
      }
    } catch (e) {
      // Provider not initialized yet
    }
  })

  onUnmounted(() => {
    _tickerCount--
    if (_tickerCount <= 0) {
      stopTicking()
    }
    unsubscribe()
  })

  const gameDate = computed<GameDate | null>(() => state.value?.date || null)
  const era = computed<Era | null>(() => state.value?.era || null)
  const population = computed(() => populations.value.reduce((sum, pop) => sum + pop.totalPopulation, 0))
  const treasury = computed(() => state.value?.resources.money || 0)
  const employedPopulation = computed(() => populations.value.reduce((sum, pop) => sum + pop.employedPopulation, 0))

  const initGame = () => {
    initializeGame()
    // Force immediate update after initialization
    try {
      state.value = provider.getState()
      buildings.value = getExtendedBuildings(state.value)
      populations.value = getExtendedPopulations(state.value)
      alerts.value = state.value.notifications.map(n => ({
        id: n.id,
        type: n.type as GameAlert['type'],
        title: n.title,
        message: n.message,
        timestamp: n.timestamp
      }))
      isInitialized.value = true
    } catch (e) {
      console.error('Failed to initialize game state:', e)
    }
  }

  const tick = () => {
    if (!isInitialized.value || !state.value || state.value.isPaused) return
    provider.dispatch(tickTime(1))
  }

  const startTicking = () => {
    if (_globalTickInterval) return
    _globalTickInterval = window.setInterval(() => {
      tick()
    }, 1000)
  }

  const stopTicking = () => {
    if (_globalTickInterval) {
      clearInterval(_globalTickInterval)
      _globalTickInterval = null
    }
  }

  const pause = () => {
    provider.dispatch(setPause())
  }

  const resume = () => {
    provider.dispatch(setResume())
  }

  const addAlert = (type: GameAlert['type'], title: string, message: string) => {
    const alertId = `alert_${Date.now()}_${Math.random()}`
    const alert: GameAlert = {
      id: alertId,
      type,
      title,
      message,
      timestamp: Date.now()
    }
    alerts.value.push(alert)
    provider.dispatch(addNotification(alertId, type, title, message))
  }

  const removeAlert = (id: string) => {
    const index = alerts.value.findIndex(a => a.id === id)
    if (index !== -1) {
      alerts.value.splice(index, 1)
    }
  }

  const createBuilding = (type: BuildingType, tileId: string) => {
    const id = `${type}_${Date.now()}_${Math.random()}`
    provider.dispatch(createBuildingAction(id, type, tileId))
    addAlert('success', '建筑完成', `已建造新的${getBuildingName(type)}`)
  }

  const removeBuilding = (buildingId: string) => {
    provider.dispatch(removeBuildingAction(buildingId))
    addAlert('success', '建筑已拆除', '建筑已被拆除')
  }

  const updateBuildingWorkers = (buildingType: BuildingType, totalWorkers: number) => {
    const buildingsByType = Array.from(state.value?.buildings.values() || [])
      .filter(b => b.type === buildingType)
    
    if (buildingsByType.length === 0) return
    
    const maxTotalWorkers = buildingsByType.reduce((sum, b) => sum + b.maxWorkers, 0)
    const clampedWorkers = Math.max(0, Math.min(totalWorkers, maxTotalWorkers))
    
    const workersPerBuilding = Math.floor(clampedWorkers / buildingsByType.length)
    const remainder = clampedWorkers % buildingsByType.length
    
    buildingsByType.forEach((building, index) => {
      const workers = workersPerBuilding + (index < remainder ? 1 : 0)
      provider.dispatch(setWorkers(building.id, workers))
    })
  }

  const updateProductionMethod = (buildingId: string, methodId: string) => {
    provider.dispatch(setProductionMethod(buildingId, methodId))
    addAlert('success', '生产方式已更新', '生产方式已成功更新')
  }



  const reset = () => {
    stopTicking()
    state.value = null
    buildings.value = []
    populations.value = []
    alerts.value = []
  }

  return {
    state,
    buildings,
    populations,
    alerts,
    gameDate,
    era,
    population,
    treasury,
    employedPopulation,
    initGame,
    tick,
    startTicking,
    stopTicking,
    pause,
    resume,
    addAlert,
    removeAlert,
    createBuilding,
    removeBuilding,
    updateBuildingWorkers,
    updateProductionMethod,
    reset
  }
}
