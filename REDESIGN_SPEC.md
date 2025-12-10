# CONTEXTO DEL PROYECTO

**Sistema:** Risk Control System (Control de Riesgo para Trading)
**Backend:** Laravel API completa (ya implementada)
**Frontend Actual:** Next.js 14, TypeScript, Tailwind, Shadcn/ui
**Estado:** MVP funcional completo

**Usuarios:** 
- Risk Managers (gestores de riesgo)
- Trading Operations (operaciones)
- Compliance (cumplimiento)

**Necesidad:** El UI actual es muy "developer-oriented", necesita ser profesional, visualmente atractivo y optimizado para toma de decisiones rápidas.# PROBLEMAS IDENTIFICADOS

## 🟡 PROBLEMAS DE USABILIDAD
1. **Falta de jerarquía visual** - Todo se ve igual
2. **Poca diferenciación** entre información crítica y normal
3. **Tablas muy densas** - Difícil escanear información
4. **Faltan visualizaciones** - Solo texto y números
5. **Espaciado inconsistente** - No hay sistema de grid claro

## 🟡 PROBLEMAS ESTÉTICOS  
1. **Look muy básico** - Parece un admin panel genérico
2. **Paleta de colores limitada** - Poco contraste
3. **Tipografía monótona** - Una sola fuente/tamaño
4. **Sin elementos visuales** - No hay íconos, badges diferenciados
5. **Estados visuales pobres** - Hover, active, loading poco definidos

## 🟡 PROBLEMAS DE FLUJO
1. **Navegación poco intuitiva** - Sidebar básica
2. **Faltan shortcuts** - Acciones frecuentes no destacadas
3. **Carga cognitiva alta** - Mucha información sin organización
4. **Responsive básico** - No optimizado para móvil
5. **Falta de feedback visual** - Acciones sin confirmación visual# DIRECCIÓN DE REDISEÑO

## 🎯 INSPIRACIÓN
- **Fintech dashboards** modernos (Bloomberg, Robinhood, TradingView)
- **Data-heavy applications** (Grafana, Datadog, Mixpanel)
- **Enterprise SaaS** (Salesforce, HubSpot)
- **Design Systems:** IBM Carbon, Ant Design, Material-UI

## 🎨 TONO Y PERSONALIDAD
- **Profesional** pero moderno
- **Confiabilidad** y precisión (financiero)
- **Claridad** sobre complejidad
- **Proactivo** más que reactivo

## 📱 PRINCIPIOS DE DISEÑO
1. **Information Hierarchy** - Lo crítico primero
2. **Visual Density** - Balance entre información y espacio
3. **Progressive Disclosure** - Mostrar lo necesario, expandir bajo demanda
4. **Consistency** - Mismos patrones en toda la app
5. **Accessibility** - WCAG 2.1 AA mínimo # NUEVO SISTEMA DE DISEÑO

## 🎨 PALETA DE COLORES
**Primary (Confianza/Profesional):**
- Primary: `#2563eb` (Azul corporativo)
- Primary Dark: `#1d4ed8`
- Primary Light: `#60a5fa`

**Semantic Colors:**
- Success: `#10b981` (Verde - operaciones exitosas)
- Warning: `#f59e0b` (Ámbar - advertencias)
- Danger: `#ef4444` (Rojo - incidentes críticos)
- Info: `#3b82f6` (Azul - información)

**Neutrals:**
- Background: `#ffffff` / `#0f172a` (dark)
- Surface: `#f8fafc` / `#1e293b`
- Border: `#e2e8f0` / `#334155`
- Text: `#1e293b` / `#f1f5f9`

## 🔤 TIPOGRAFÍA
**Font Family:** Inter (actual, mantener)
**Scale:**
- Display: `text-4xl` (36px) - Títulos principales
- Title: `text-2xl` (24px) - Títulos sección
- Heading: `text-xl` (20px) - Subtítulos
- Body: `text-base` (16px) - Texto normal
- Caption: `text-sm` (14px) - Labels, metadata

## 📏 ESPACIADO
**Base Unit:** 4px
**Scale:**
- xs: 4px (gap-1)
- sm: 8px (gap-2)
- md: 16px (gap-4)
- lg: 24px (gap-6)
- xl: 32px (gap-8)

## 🧱 COMPONENT STYLES
**Border Radius:**
- sm: 4px (botones pequeños)
- md: 8px (cards, inputs)
- lg: 12px (modales, containers grandes)

**Shadows:**
- sm: `shadow-sm` - elementos elevados
- md: `shadow-md` - cards, dropdowns
- lg: `shadow-lg` - modales, overlays

**Transitions:**
- Fast: `duration-150`
- Normal: `duration-300`
- Slow: `duration-500`# COMPONENTES PRIORITARIOS

## 🏗️ LAYOUT COMPONENTS
1. **Main Layout** (`app/layout.tsx`)
   - Sidebar con navegación mejorada
   - Header con breadcrumbs y acciones
   - Sistema de grid responsive

2. **Dashboard Grid** (`app/page.tsx`)
   - Sistema de grid flexible
   - Widgets de diferentes tamaños
   - Drag & drop (opcional futuro)

## 📊 DATA COMPONENTS  
3. **DataTable Redesign** (`components/ui/table.tsx`)
   - Row highlighting
   - Compact/Expanded views
   - Better filtering UI
   - Batch actions

4. **Stats Cards** (`components/ui/card.tsx`)
   - Variants: Metric, Trend, Status
   - Icon integration
   - Sparkline charts
   - Action buttons

5. **Charts Integration**
   - Recharts o Tremor para gráficos
   - Sparklines para mini-trends
   - Donuts para distribución

## ✏️ FORM COMPONENTS
6. **Form Layouts**
   - Better validation states
   - Inline help text
   - Progress indicators
   - Step forms

7. **Filter Components**
   - Advanced filter panel
   - Saved filters
   - Quick filter chips

## 🚨 FEEDBACK COMPONENTS
8. **Alert System**
   - Toast notifications
   - Inline alerts
   - Banner notifications

9. **Empty States**
   - Ilustraciones SVG
   - Action prompts
   - Loading skeletons ## 📁 APP/ DIRECTORY
app/
├── layout.tsx # Main layout
├── page.tsx # Dashboard
├── rules/
│ ├── page.tsx # Rules list
│ ├── create/
│ │ └── page.tsx # Create rule
│ ├── edit/
│ │ └── [id]/
│ │ └── page.tsx # Edit rule
│ └── actions/
│ └── [id]/
│ └── page.tsx # Rule actions
├── accounts/
│ ├── page.tsx # Accounts list
│ └── [id]/
│ ├── page.tsx # Account detail
│ ├── trades/
│ │ └── page.tsx # Account trades
│ └── risk/
│ └── page.tsx # Risk analysis
├── incidents/
│ ├── page.tsx # Incidents list
│ └── [id]/
│ └── page.tsx # Incident detail
└── trades/
└── page.tsx # Trades list

text

## 📁 COMPONENTS/ DIRECTORY
components/
├── ui/ # Shadcn/ui components
│ ├── button.tsx
│ ├── card.tsx
│ ├── table.tsx
│ ├── input.tsx
│ ├── select.tsx
│ ├── switch.tsx
│ ├── dialog.tsx
│ ├── tabs.tsx
│ └── badge.tsx
├── layout/
│ ├── header.tsx
│ ├── sidebar.tsx
│ └── layout-wrapper.tsx
└── shared/
├── api-status.tsx
├── loading-spinner.tsx
├── pagination.tsx
└── error-boundary.tsx

text

## 📁 LIB/ DIRECTORY
lib/
├── api/
│ ├── client.ts # Axios client
│ ├── endpoints.ts # API endpoints
│ └── types.ts # TypeScript types
├── utils/
│ ├── formatters.ts # Format functions
│ ├── validators.ts # Validation utils
│ └── constants.ts # App constants
└── hooks/
├── use-api.ts # API hooks
├── use-risk-rules.ts # Risk rules hooks
└── use-incidents.ts # Incidents hooks 
---

## 📄 **7. IMPLEMENTACIÓN POR ETAPAS**

```markdown
# PLAN DE IMPLEMENTACIÓN

## ETAPA 1: FUNDACIÓN (Día 1-2)
### Objetivo: Sistema de diseño base
1. **Actualizar Tailwind config** con nueva paleta
2. **Crear CSS variables** para theming
3. **Rediseñar layout.tsx** con nueva estructura
4. **Actualizar componentes base** (Button, Card, Input)
5. **Implementar dark/light mode**

## ETAPA 2: DASHBOARD (Día 3)
### Objetivo: Página principal rediseñada
1. **Rediseñar app/page.tsx** con grid system
2. **Crear nuevos Stats Cards** con variants
3. **Agregar mini-charts** (Recharts/Tremor)
4. **Mejorar data tables** con mejor UX
5. **Implementar loading skeletons**

## ETAPA 3: PÁGINAS PRINCIPALES (Día 4-5)
### Objetivo: Rediseñar vistas críticas
1. **Rules pages** - Mejorar formularios y listas
2. **Incidents pages** - Mejorar workflow
3. **Accounts pages** - Mejorar análisis de datos
4. **Trades pages** - Mejorar visualización

## ETAPA 4: COMPONENTES AVANZADOS (Día 6)
### Objetivo: Mejorar experiencia
1. **Advanced filtering system**
2. **Bulk actions** en tablas
3. **Export functionality**
4. **Keyboard shortcuts**
5. **Search improvements**

## ETAPA 5: POLISH (Día 7)
### Objetivo: Refinamiento final
1. **Animaciones y transiciones**
2. **Micro-interactions**
3. **Accessibility audit**
4. **Performance optimization**
5. **Cross-browser testing** # INSTRUCCIONES PARA GITHUB COPILOT

## 📋 CÓMO PROCEDER

### FASE 1: ANALIZAR CÓDIGO ACTUAL
1. **Examinar toda la estructura** del proyecto
2. **Identificar patrones de uso** de componentes
3. **Entender flujos de datos** y API calls
4. **Mapear todas las páginas** y sus relaciones

### FASE 2: APLICAR SISTEMA DE DISEÑO
1. **Comenzar por tailwind.config.ts** - actualizar colores, spacing
2. **Actualizar layout.tsx** - nueva estructura de grid
3. **Refactorizar componentes base** (Button, Card, Input, etc.)
4. **Mantener compatibilidad** - no romper funcionalidad existente

### FASE 3: IMPLEMENTAR NUEVOS PATRONES
Para cada componente/página:
1. **Mantener la lógica** exactamente igual
2. **Mejorar la estructura HTML** para mejor semántica
3. **Aplicar nuevos estilos** del sistema de diseño
4. **Agregar estados visuales** (hover, active, disabled, loading)
5. **Optimizar para responsive** (mobile/tablet/desktop)

### FASE 4: VALIDACIÓN
Para cada cambio:
1. **Verificar que API calls** siguen funcionando
2. **Confirmar TypeScript types** son correctos
3. **Testear interactividad** (clicks, forms, filters)
4. **Revisar accesibilidad** (ARIA labels, keyboard nav)

## 🎯 PRINCIPIOS GUIAS

### MANTENER:
- ✅ Toda la funcionalidad actual
- ✅ TypeScript types y interfaces  
- ✅ Estructura de carpetas
- ✅ Nombre de componentes
- ✅ Lógica de negocio
- ✅ Integración con API

### MEJORAR:
- 🎨 Estética y visual design
- 📏 Espaciado y jerarquía
- 📱 Responsive design
- ♿ Accessibility
- 🚀 Performance visual
- 💡 UX flows

### AGREGAR (OPCIONAL):
- 📊 Data visualization simple
- 🎭 Micro-interactions
- 🌓 Dark/light mode refinado
- ⚡ Loading states mejorados
- 🔍 Search enhancements Redesign the main layout to be more professional and scalable.

Current layout.tsx has:
- Basic sidebar with links
- Simple header
- Main content area

Transform into:
1. Collapsible sidebar with nested navigation
2. Sticky header with breadcrumbs and user menu
3. Main content with proper grid system
4. Mobile-optimized hamburger menu
5. Consistent spacing using the new design system

Keep all routing and functionality identical. Redesign the dashboard page to be a true financial dashboard.

Current page.tsx has:
- Basic stat cards
- Simple lists
- No data visualization

Transform into:
1. Grid-based layout with different widget sizes
2. Enhanced stat cards with trend indicators
3. Mini-charts for key metrics
4. Recent activity timeline
5. Quick action buttons
6. Risk level visualization

Use Recharts for simple charts. Maintain all data fetching. Redesign data tables for better scanning and interaction.

Current table components are basic HTML tables.

Transform into:
1. Row highlighting on hover
2. Compact and expanded view options
3. Sticky headers on scroll
4. Better pagination controls
5. Inline filtering
6. Batch action toolbar
7. Loading skeletons

Keep all sorting, filtering, and pagination logic.