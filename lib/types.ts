export type UserRole = 'owner' | 'admin' | 'agent' | 'analyst';

export type NavigationTab =
  | 'dashboard'
  | 'workflows'
  | 'inbox'
  | 'sheets'
  | 'drive'
  | 'calendar'
  | 'products'
  | 'orders'
  | 'analytics'
  | 'simulator'
  | 'facebook'
  | 'tenants';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  customDomain?: string;
  plan: 'starter' | 'growth' | 'enterprise';
  createdAt: string;
  channelsCount: number;
  ordersCount: number;
  revenueBdt: number;
}

export interface FacebookChannelConfig {
  id: string;
  pageName: string;
  pageId: string;
  accessToken: string;
  verifyToken: string;
  isConnected: boolean;
  webhookStatus: string;
  subscribedFields: string[];
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  aiHandlingRate: number;
  averageResponseTimeSeconds: number;
  intentBreakdown: { intent: string; count: number; percentage: number }[];
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  businessType: string;
  currency: string;
  timezone: string;
  activeFacebookPageId?: string;
  sheetConnected: boolean;
  driveConnected: boolean;
  calendarConnected: boolean;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  delivery: string;
  description: string;
  imageUrl?: string;
  driveFileId?: string;
  driveFolder?: string;
  category?: string;
  updatedAt: string;
}

export interface SheetColumnMapping {
  sku: string;
  product_name: string;
  price: string;
  stock: string;
  sizes: string;
  colors: string;
  delivery: string;
  description: string;
  drive_image_id?: string;
}

export interface GoogleSheetConfig {
  spreadsheetId: string;
  spreadsheetName: string;
  worksheetTitle: string;
  lastSyncedAt?: string;
  syncStatus: 'synced' | 'syncing' | 'error' | 'idle';
  rowCount: number;
  columns: string[];
  mapping: SheetColumnMapping;
}

export interface GoogleDriveAsset {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  skuMatch?: string;
  fileSize?: string;
  modifiedTime: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  customerName?: string;
  customerPhone?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  conversationId?: string;
}

export interface FacebookPageChannel {
  id: string;
  name: string;
  pageId: string;
  category: string;
  status: 'connected' | 'needs_reconnect' | 'disconnected';
  webhookSubscribed: boolean;
  followersCount: number;
  lastActive: string;
}

export type IntentType =
  | 'product_inquiry'
  | 'price_inquiry'
  | 'stock_inquiry'
  | 'size_color_inquiry'
  | 'delivery_inquiry'
  | 'discount_inquiry'
  | 'order_request'
  | 'order_status'
  | 'callback_schedule'
  | 'human_support'
  | 'general_faq'
  | 'unknown';

export interface MessageItem {
  id: string;
  sender: 'customer' | 'ai' | 'agent';
  content: string;
  timestamp: string;
  intent?: IntentType;
  groundedFactsUsed?: string[];
  confidence?: number;
  executionId?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  psid: string;
  phone?: string;
  email?: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  tags: string[];
  lastActive: string;
}

export interface ConversationItem {
  id: string;
  customer: CustomerProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  aiActive: boolean;
  assignedAgent?: string;
  status: 'active' | 'waiting_human' | 'resolved';
  messages: MessageItem[];
  notes?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: {
    sku: string;
    productName: string;
    quantity: number;
    price: number;
    variant: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'new' | 'pending_confirmation' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  sourceChannel: string;
}

export type NodeType =
  | 'trigger_messenger'
  | 'trigger_webhook'
  | 'ai_intent_classifier'
  | 'ai_grounded_agent'
  | 'data_google_sheets'
  | 'data_google_drive'
  | 'data_calendar_check'
  | 'logic_condition'
  | 'action_messenger_reply'
  | 'action_calendar_book'
  | 'action_create_order'
  | 'action_human_handoff';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  x: number;
  y: number;
  config: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  version: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  triggerSource: string;
  customerInput: string;
  status: 'success' | 'running' | 'failed';
  startedAt: string;
  completedAt?: string;
  steps: {
    nodeId: string;
    nodeName: string;
    status: 'success' | 'running' | 'failed' | 'skipped';
    output: string;
    durationMs: number;
  }[];
}
