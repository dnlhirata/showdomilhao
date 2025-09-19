# Show do Milhão - Divisão de Tarefas (2 Pessoas) 🚀

## 📋 MVP: Quiz com 4 alternativas + 3 ajudas

**Funcionalidades**: Quiz, Pular (3x), Universitários (1x), Cartas (1x)  
**SEM**: Testes, histórico, otimizações

---

## 📋 LISTA DE TAREFAS (Pegar Conforme Disponibilidade)

### 🚀 **FASE 1 - Fundação (Sem Dependências)**
- [x] **T1** - Setup projeto React + TypeScript + Vite ✅
- [x] **T2** - Criar arquivo questions.json (35 perguntas organizadas por nível) ✅
- [x] **T3** - Criar tipos TypeScript (Question, GameState, HelpType, etc) ✅

### 🔗 **FASE 2 - Core (Dependências: T1, T3)**
- [x] **T4** - Hook useGameState (gerenciar estado do jogo) ✅
  - **Depende de**: T3 (tipos)
- [x] **T5** - Componente principal App.tsx (UI/Frontend apenas) ✅
  - **Depende de**: T1 (setup), T3 (tipos)
- [x] **T6** - Componente QuestionCard (pergunta + 4 alternativas) ✅
  - **Depende de**: T3 (tipos)

### 🎯 **FASE 3 - Funcionalidades (Dependências: T4, T5, T6)**
- [x] **T7** - Lógica de validação de respostas ✅
  - **Depende de**: T4 (hook), T2 (questions.json)
- [x] **T8** - Componente PrizeTracker (escada de prêmios) ✅
  - **Depende de**: T3 (tipos)
- [ ] **T9** - Integração componentes + hook
  - **Depende de**: T4, T5, T6, T7

### 🆘 **FASE 4 - Ajudas (Dependências: T9)**
- [ ] **T10** - Funcionalidade "Pular" (máx 3x)
  - **Depende de**: T9 (integração básica)
- [ ] **T11** - Sistema "Ajuda Universitários" (% por alternativa)
  - **Depende de**: T9 (integração básica)
- [ ] **T12** - Sistema "Cartas" (eliminar 1, 2 ou 3 alternativas)
  - **Depende de**: T9 (integração básica)

### 🎨 **FASE 5 - Interface (Dependências: T10, T11, T12)**
- [ ] **T13** - CSS básico + layout responsivo
  - **Depende de**: T8 (PrizeTracker), T6 (QuestionCard)
- [ ] **T14** - Feedback visual (verde/vermelho para respostas)
  - **Depende de**: T7 (validação)
- [ ] **T15** - Lógica de Game Over + vitória
  - **Depende de**: T10, T11, T12 (todas ajudas)

### 🚀 **FASE 6 - Finalização (Dependências: Todas anteriores)**
- [ ] **T16** - Testes manuais + correções de bugs
  - **Depende de**: T13, T14, T15
- [ ] **T17** - Deploy no Vercel/Netlify
  - **Depende de**: T16 (testes)

---

## 🕐 SUGESTÃO DE CRONOGRAMA

### **DIA 1 - Manhã (4h)**
- **Paralelo**: T1, T2, T3 (sem dependências)
- **Sequencial**: T4, T5, T6 (após T1 e T3 prontos)

### **DIA 1 - Tarde (4h)**  
- **T7** - Validação (após T4 e T2)
- **T8** - PrizeTracker (após T3)
- **T9** - Integração (CRÍTICA - final do dia)

### **DIA 2 - Manhã (4h)**
- **Paralelo**: T10, T11, T12 (ajudas - após T9)

### **DIA 2 - Tarde (4h)**
- **T13, T14** - Interface + feedback
- **T15** - Game Over (após todas ajudas)
- **T16, T17** - Testes + deploy

---

## ⚠️ DEPENDÊNCIAS CRÍTICAS

### **🚫 Bloqueadores (não podem atrasar)**
- **T3** (tipos) → bloqueia T4, T5, T6, T8
- **T9** (integração) → bloqueia T10, T11, T12
- **T1** (setup) → bloqueia T5

### **✅ Podem fazer em paralelo**
- **T1, T2, T3** → início simultâneo
- **T4, T6** → após T3 pronto
- **T10, T11, T12** → após T9 pronto
- **T13, T14** → podem ser simultâneas

### **📋 Ordem sugerida de prioridade**
1. **T1** (setup) - 30min
2. **T3** (tipos) - 30min  
3. **T2** (questions.json) - 1h
4. **T4** (hook) - 1.5h
5. **T5** (App) - 1h
6. **T6** (QuestionCard) - 1h
7. **T7** (validação) - 45min
8. **T8** (PrizeTracker) - 45min
9. **T9** (integração) - 1h
10. **T10, T11, T12** (ajudas) - 3h total
11. **T13, T14** (CSS + feedback) - 2h
12. **T15** (game over) - 1h
13. **T16** (testes) - 1h  
14. **T17** (deploy) - 30min

---

## 📝 ESPECIFICAÇÕES TÉCNICAS

### **📋 Detalhes das Tarefas**

#### **T3 - Tipos TypeScript**
```typescript
// src/types.ts
export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  level: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  currentQuestionIndex: number;
  currentQuestion: Question | null;
  score: number;
  skipsLeft: number;
  universitiesUsed: boolean;
  cardsUsed: boolean;
  gameOver: boolean;
  won: boolean;
  hiddenOptions: number[];
}

export type HelpType = 'skip' | 'university' | 'cards';
```

#### **T4 - Hook useGameState**
```typescript
// src/hooks/useGameState.ts
export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({...});
  
  const answerQuestion = (optionIndex: number) => { /* lógica */ };
  const skipQuestion = () => { /* lógica */ };
  const useUniversityHelp = () => { /* lógica */ };
  const useCardsHelp = (cardValue: 1 | 2 | 3) => { /* lógica */ };
  const resetGame = () => { /* lógica */ };
  
  return { gameState, answerQuestion, skipQuestion, ... };
};
```

#### **T2 - Estrutura questions.json**
```json
{
  "questions": [
    {
      "id": 1,
      "question": "Qual é a capital do Brasil?",
      "options": ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
      "correct": 2,
      "level": "easy"
    }
  ],
  "prizes": [1000, 2000, 5000, 10000, 20000, 50000, 100000, 300000, 500000, 1000000]
}
```

---

## 🤝 ORGANIZAÇÃO DA DUPLA

### **📢 Comunicação**
- Updates quando completar tarefa
- Avisar se travar > 30min em uma tarefa
- Confirmar antes de pegar tarefa com dependência

### **🔀 Git/Commits**
- `feat: T1 - setup react typescript project`
- `feat: T3 - add game types and interfaces`
- `feat: T4 - implement useGameState hook`
- `feat: T9 - integrate components with game logic`

### **📋 Status das Tarefas**
Marcar como feito conforme completam:
- [x] T1 - Setup projeto React + TypeScript + Vite ✅
- [x] T2 - questions.json (35 perguntas organizadas por nível) ✅
- [x] T3 - Tipos TypeScript (interfaces completas) ✅
- [x] T4 - Hook useGameState (lógica completa do jogo) ✅
- [x] T5 - Componente principal App.tsx (UI/Frontend com mocks) ✅
- [x] T7 - Lógica de validação de respostas (utilitários completos) ✅
- [x] T8 - Componente PrizeTracker (escada visual completa) ✅

---

## 🎯 RESULTADO FINAL ESPERADO

✅ **Jogo funcional com:**
- Quiz 15 perguntas (fácil → difícil)
- Pular (3x), Universitários (1x), Cartas (1x)
- Interface apresentável desktop/mobile
- Deploy online funcionando

✅ **Tempo total**: 16h (2 pessoas × 8h/dia × 2 dias)

---

**🚀 COMEÇAR AGORA: Pessoa A faz setup, Pessoa B começa questions.json!**
