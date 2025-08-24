import { renderHook, act } from '@testing-library/react'
import { useResponsive } from '@/hooks/useResponsive'

// Mock do window
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: mockWindow.innerWidth
})

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: mockWindow.innerHeight
})

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockWindow.addEventListener
})

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockWindow.removeEventListener
})

describe('useResponsive', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.innerWidth = 1024
    window.innerHeight = 768
  })

  it('deve retornar valores corretos para desktop', () => {
    window.innerWidth = 1200
    
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(true)
    expect(result.current.isSmallScreen).toBe(false)
    expect(result.current.isMediumScreen).toBe(false)
    expect(result.current.isLargeScreen).toBe(false)
    expect(result.current.isExtraLargeScreen).toBe(false)
  })

  it('deve retornar valores corretos para mobile', () => {
    window.innerWidth = 400
    
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(true)
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.isSmallScreen).toBe(true)
    expect(result.current.isMediumScreen).toBe(false)
    expect(result.current.isLargeScreen).toBe(false)
    expect(result.current.isExtraLargeScreen).toBe(false)
  })

  it('deve retornar valores corretos para tablet', () => {
    window.innerWidth = 800
    
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isMobile).toBe(false)
    expect(result.current.isTablet).toBe(true)
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.isSmallScreen).toBe(false)
    expect(result.current.isMediumScreen).toBe(false)
    expect(result.current.isLargeScreen).toBe(true)
    expect(result.current.isExtraLargeScreen).toBe(false)
  })

  it('deve retornar valores corretos para tela extra grande', () => {
    window.innerWidth = 1400
    
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.isExtraLargeScreen).toBe(true)
  })

  it('deve adicionar listener de resize', () => {
    renderHook(() => useResponsive())
    
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('deve remover listener de resize na desmontagem', () => {
    const { unmount } = renderHook(() => useResponsive())
    
    unmount()
    
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('deve atualizar valores quando janela é redimensionada', () => {
    const { result } = renderHook(() => useResponsive())
    
    // Inicialmente desktop
    expect(result.current.isDesktop).toBe(true)
    expect(result.current.isMobile).toBe(false)
    
    // Simula redimensionamento para mobile
    act(() => {
      window.innerWidth = 400
      window.dispatchEvent(new Event('resize'))
    })
    
    expect(result.current.isDesktop).toBe(false)
    expect(result.current.isMobile).toBe(true)
  })

  it('deve usar breakpoints personalizados', () => {
    const customBreakpoints = {
      sm: 500,
      md: 900,
      lg: 1200,
      xl: 1500
    }
    
    window.innerWidth = 800
    
    const { result } = renderHook(() => useResponsive(customBreakpoints))
    
    expect(result.current.isMobile).toBe(true) // 800 < 900
    expect(result.current.isTablet).toBe(false)
    expect(result.current.isDesktop).toBe(false)
  })

  it('deve retornar tamanho da tela atual', () => {
    window.innerWidth = 1200
    window.innerHeight = 800
    
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.screenSize.width).toBe(1200)
    expect(result.current.screenSize.height).toBe(800)
  })

  it('deve retornar breakpoints configurados', () => {
    const customBreakpoints = {
      sm: 500,
      md: 900,
      lg: 1200,
      xl: 1500
    }
    
    const { result } = renderHook(() => useResponsive(customBreakpoints))
    
    expect(result.current.breakpoints).toEqual(customBreakpoints)
  })

  it('deve lidar com ambiente sem window', () => {
    // Simula ambiente servidor (sem window)
    const originalWindow = global.window
    delete (global as any).window
    
    const { result } = renderHook(() => useResponsive())
    
    expect(result.current.screenSize.width).toBe(0)
    expect(result.current.screenSize.height).toBe(0)
    
    // Restaura window
    global.window = originalWindow
  })
})