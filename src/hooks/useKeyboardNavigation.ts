'use client';

import { useEffect, useCallback, KeyboardEvent as ReactKeyboardEvent } from 'react';

/**
 * Opções para o hook de navegação por teclado
 */
type KeyboardNavigationOptions = {
  onArrowUp?: (event: KeyboardEvent) => void;
  onArrowDown?: (event: KeyboardEvent) => void;
  onArrowLeft?: (event: KeyboardEvent) => void;
  onArrowRight?: (event: KeyboardEvent) => void;
  onEnter?: (event: KeyboardEvent) => void;
  onEscape?: (event: KeyboardEvent) => void;
  onTab?: (event: KeyboardEvent) => void;
  onSpace?: (event: KeyboardEvent) => void;
  onHome?: (event: KeyboardEvent) => void;
  onEnd?: (event: KeyboardEvent) => void;
  onPageUp?: (event: KeyboardEvent) => void;
  onPageDown?: (event: KeyboardEvent) => void;
  onBackspace?: (event: KeyboardEvent) => void;
  onDelete?: (event: KeyboardEvent) => void;
  onShiftTab?: (event: KeyboardEvent) => void;
  onAlt?: (event: KeyboardEvent) => void;
  onCtrl?: (event: KeyboardEvent) => void;
  onShift?: (event: KeyboardEvent) => void;
  onMeta?: (event: KeyboardEvent) => void;
  onAltArrowUp?: (event: KeyboardEvent) => void;
  onAltArrowDown?: (event: KeyboardEvent) => void;
  onAltArrowLeft?: (event: KeyboardEvent) => void;
  onAltArrowRight?: (event: KeyboardEvent) => void;
  onCtrlArrowUp?: (event: KeyboardEvent) => void;
  onCtrlArrowDown?: (event: KeyboardEvent) => void;
  onCtrlArrowLeft?: (event: KeyboardEvent) => void;
  onCtrlArrowRight?: (event: KeyboardEvent) => void;
  onShiftArrowUp?: (event: KeyboardEvent) => void;
  onShiftArrowDown?: (event: KeyboardEvent) => void;
  onShiftArrowLeft?: (event: KeyboardEvent) => void;
  onShiftArrowRight?: (event: KeyboardEvent) => void;
  onCtrlEnter?: (event: KeyboardEvent) => void;
  onShiftEnter?: (event: KeyboardEvent) => void;
  onCtrlSpace?: (event: KeyboardEvent) => void;
  onShiftSpace?: (event: KeyboardEvent) => void;
  onCtrlHome?: (event: KeyboardEvent) => void;
  onCtrlEnd?: (event: KeyboardEvent) => void;
  onShiftHome?: (event: KeyboardEvent) => void;
  onShiftEnd?: (event: KeyboardEvent) => void;
  onCtrlShiftHome?: (event: KeyboardEvent) => void;
  onCtrlShiftEnd?: (event: KeyboardEvent) => void;
  onCtrlA?: (event: KeyboardEvent) => void;
  onCtrlC?: (event: KeyboardEvent) => void;
  onCtrlV?: (event: KeyboardEvent) => void;
  onCtrlX?: (event: KeyboardEvent) => void;
  onCtrlZ?: (event: KeyboardEvent) => void;
  onCtrlY?: (event: KeyboardEvent) => void;
  onCtrlF?: (event: KeyboardEvent) => void;
  onCtrlS?: (event: KeyboardEvent) => void;
  onCtrlP?: (event: KeyboardEvent) => void;
  onF1?: (event: KeyboardEvent) => void;
  onF2?: (event: KeyboardEvent) => void;
  onF3?: (event: KeyboardEvent) => void;
  onF4?: (event: KeyboardEvent) => void;
  onF5?: (event: KeyboardEvent) => void;
  onF6?: (event: KeyboardEvent) => void;
  onF7?: (event: KeyboardEvent) => void;
  onF8?: (event: KeyboardEvent) => void;
  onF9?: (event: KeyboardEvent) => void;
  onF10?: (event: KeyboardEvent) => void;
  onF11?: (event: KeyboardEvent) => void;
  onF12?: (event: KeyboardEvent) => void;
  targetKey?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  eventType?: 'keydown' | 'keyup' | 'keypress';
  target?: HTMLElement | null | (() => HTMLElement | null);
};

/**
 * Hook para gerenciar navegação por teclado
 * @param options Opções de navegação por teclado
 * @returns Objeto com função para lidar com eventos de teclado
 */
const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    preventDefault = false,
    stopPropagation = false,
    eventType = 'keydown',
    target = null,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isAltPressed = event.altKey;
      const isCtrlPressed = event.ctrlKey;
      const isShiftPressed = event.shiftKey;
      const isMetaPressed = event.metaKey;

      // Se um targetKey foi especificado e a tecla não corresponde, não faz nada
      if (options.targetKey && event.key !== options.targetKey) {
        return;
      }

      // Combinações de teclas com modificadores
      if (isCtrlPressed && isShiftPressed) {
        if (event.key === 'Home' && options.onCtrlShiftHome) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlShiftHome(event);
          return;
        }
        if (event.key === 'End' && options.onCtrlShiftEnd) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlShiftEnd(event);
          return;
        }
      }

      // Combinações com Ctrl
      if (isCtrlPressed && !isShiftPressed && !isAltPressed) {
        if (event.key === 'ArrowUp' && options.onCtrlArrowUp) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlArrowUp(event);
          return;
        }
        if (event.key === 'ArrowDown' && options.onCtrlArrowDown) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlArrowDown(event);
          return;
        }
        if (event.key === 'ArrowLeft' && options.onCtrlArrowLeft) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlArrowLeft(event);
          return;
        }
        if (event.key === 'ArrowRight' && options.onCtrlArrowRight) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlArrowRight(event);
          return;
        }
        if (event.key === 'Enter' && options.onCtrlEnter) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlEnter(event);
          return;
        }
        if (event.key === ' ' && options.onCtrlSpace) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlSpace(event);
          return;
        }
        if (event.key === 'Home' && options.onCtrlHome) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlHome(event);
          return;
        }
        if (event.key === 'End' && options.onCtrlEnd) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlEnd(event);
          return;
        }
        if (event.key === 'a' && options.onCtrlA) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlA(event);
          return;
        }
        if (event.key === 'c' && options.onCtrlC) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlC(event);
          return;
        }
        if (event.key === 'v' && options.onCtrlV) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlV(event);
          return;
        }
        if (event.key === 'x' && options.onCtrlX) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlX(event);
          return;
        }
        if (event.key === 'z' && options.onCtrlZ) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlZ(event);
          return;
        }
        if (event.key === 'y' && options.onCtrlY) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlY(event);
          return;
        }
        if (event.key === 'f' && options.onCtrlF) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlF(event);
          return;
        }
        if (event.key === 's' && options.onCtrlS) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlS(event);
          return;
        }
        if (event.key === 'p' && options.onCtrlP) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onCtrlP(event);
          return;
        }
      }

      // Combinações com Shift
      if (isShiftPressed && !isCtrlPressed && !isAltPressed) {
        if (event.key === 'Tab' && options.onShiftTab) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftTab(event);
          return;
        }
        if (event.key === 'ArrowUp' && options.onShiftArrowUp) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftArrowUp(event);
          return;
        }
        if (event.key === 'ArrowDown' && options.onShiftArrowDown) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftArrowDown(event);
          return;
        }
        if (event.key === 'ArrowLeft' && options.onShiftArrowLeft) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftArrowLeft(event);
          return;
        }
        if (event.key === 'ArrowRight' && options.onShiftArrowRight) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftArrowRight(event);
          return;
        }
        if (event.key === 'Enter' && options.onShiftEnter) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftEnter(event);
          return;
        }
        if (event.key === ' ' && options.onShiftSpace) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftSpace(event);
          return;
        }
        if (event.key === 'Home' && options.onShiftHome) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftHome(event);
          return;
        }
        if (event.key === 'End' && options.onShiftEnd) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onShiftEnd(event);
          return;
        }
      }

      // Combinações com Alt
      if (isAltPressed && !isCtrlPressed && !isShiftPressed) {
        if (event.key === 'ArrowUp' && options.onAltArrowUp) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onAltArrowUp(event);
          return;
        }
        if (event.key === 'ArrowDown' && options.onAltArrowDown) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onAltArrowDown(event);
          return;
        }
        if (event.key === 'ArrowLeft' && options.onAltArrowLeft) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onAltArrowLeft(event);
          return;
        }
        if (event.key === 'ArrowRight' && options.onAltArrowRight) {
          if (preventDefault) event.preventDefault();
          if (stopPropagation) event.stopPropagation();
          options.onAltArrowRight(event);
          return;
        }
      }

      // Teclas modificadoras
      if (isAltPressed && options.onAlt) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onAlt(event);
        return;
      }
      if (isCtrlPressed && options.onCtrl) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onCtrl(event);
        return;
      }
      if (isShiftPressed && options.onShift) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onShift(event);
        return;
      }
      if (isMetaPressed && options.onMeta) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onMeta(event);
        return;
      }

      // Teclas de função
      if (event.key === 'F1' && options.onF1) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF1(event);
        return;
      }
      if (event.key === 'F2' && options.onF2) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF2(event);
        return;
      }
      if (event.key === 'F3' && options.onF3) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF3(event);
        return;
      }
      if (event.key === 'F4' && options.onF4) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF4(event);
        return;
      }
      if (event.key === 'F5' && options.onF5) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF5(event);
        return;
      }
      if (event.key === 'F6' && options.onF6) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF6(event);
        return;
      }
      if (event.key === 'F7' && options.onF7) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF7(event);
        return;
      }
      if (event.key === 'F8' && options.onF8) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF8(event);
        return;
      }
      if (event.key === 'F9' && options.onF9) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF9(event);
        return;
      }
      if (event.key === 'F10' && options.onF10) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF10(event);
        return;
      }
      if (event.key === 'F11' && options.onF11) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF11(event);
        return;
      }
      if (event.key === 'F12' && options.onF12) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        options.onF12(event);
        return;
      }

      // Teclas básicas
      switch (event.key) {
        case 'ArrowUp':
          if (options.onArrowUp) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onArrowUp(event);
          }
          break;
        case 'ArrowDown':
          if (options.onArrowDown) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onArrowDown(event);
          }
          break;
        case 'ArrowLeft':
          if (options.onArrowLeft) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onArrowLeft(event);
          }
          break;
        case 'ArrowRight':
          if (options.onArrowRight) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onArrowRight(event);
          }
          break;
        case 'Enter':
          if (options.onEnter) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onEnter(event);
          }
          break;
        case 'Escape':
          if (options.onEscape) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onEscape(event);
          }
          break;
        case 'Tab':
          if (options.onTab) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onTab(event);
          }
          break;
        case ' ':
          if (options.onSpace) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onSpace(event);
          }
          break;
        case 'Home':
          if (options.onHome) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onHome(event);
          }
          break;
        case 'End':
          if (options.onEnd) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onEnd(event);
          }
          break;
        case 'PageUp':
          if (options.onPageUp) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onPageUp(event);
          }
          break;
        case 'PageDown':
          if (options.onPageDown) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onPageDown(event);
          }
          break;
        case 'Backspace':
          if (options.onBackspace) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onBackspace(event);
          }
          break;
        case 'Delete':
          if (options.onDelete) {
            if (preventDefault) event.preventDefault();
            if (stopPropagation) event.stopPropagation();
            options.onDelete(event);
          }
          break;
      }
    },
    [options, preventDefault, stopPropagation]
  );

  useEffect(() => {
    const targetElement = typeof target === 'function' ? target() : target;
    const element = targetElement || document;

    element.addEventListener(eventType, handleKeyDown as EventListener);

    return () => {
      element.removeEventListener(eventType, handleKeyDown as EventListener);
    };
  }, [handleKeyDown, eventType, target]);

  return {
    handleKeyDown: (event: ReactKeyboardEvent) => handleKeyDown(event.nativeEvent),
  };
};

export default useKeyboardNavigation;
