import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json as json$1 } from "@remix-run/node";
import { RemixServer, useNavigate, useLocation, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, json, NavLink, Link } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import * as React from "react";
import React__default, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2, toast as toast$1 } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon, CaretSortIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as ToastPrimitives from "@radix-ui/react-toast";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as SelectPrimitive from "@radix-ui/react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2, PlusCircle, Edit, Trash2, Download, Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { z as z$1 } from "zod";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { useMotionValue, useSpring, AnimatePresence, motion, useInView } from "framer-motion";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { encode } from "qss";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext);
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url, abortDelay: ABORT_DELAY }),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url, abortDelay: ABORT_DELAY }),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const Toaster$1 = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Sheet = SheetPrimitive.Root;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(sheetVariants({ side }), className),
      ...props,
      children: [
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
          /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] }),
        children
      ]
    }
  )
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-foreground/80",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1e6;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action2) => {
  switch (action2.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action2.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => t.id === action2.toast.id ? { ...t, ...action2.toast } : t)
      };
    case "DISMISS_TOAST": {
      const { toastId } = action2;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        for (const toast2 of state.toasts) {
          addToRemoveQueue(toast2.id);
        }
      }
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? {
            ...t,
            open: false
          } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action2.toastId === void 0) {
        return {
          ...state,
          toasts: []
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action2.toastId)
      };
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action2) {
  memoryState = reducer(memoryState, action2);
  for (const listener of listeners) {
    listener(memoryState);
  }
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST",
    toast: { ...props2, id }
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return {
    id,
    dismiss,
    update
  };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
const defaultSubscriptions = [
  { id: "1", name: "Netflix", price: 15.99, currency: "USD", domain: "https://netflix.com" },
  { id: "2", name: "Spotify", price: 9.99, currency: "USD", domain: "https://spotify.com" },
  { id: "3", name: "Amazon Prime", price: 14.99, currency: "USD", domain: "https://amazon.com" },
  { id: "4", name: "Disney+", price: 7.99, currency: "USD", domain: "https://disneyplus.com" },
  { id: "5", name: "YouTube Premium", price: 11.99, currency: "USD", domain: "https://youtube.com" },
  { id: "6", name: "Hulu", price: 7.99, currency: "USD", domain: "https://hulu.com" },
  { id: "7", name: "Apple Music", price: 9.99, currency: "JPY", domain: "https://apple.com/apple-music" },
  { id: "8", name: "HBO Max", price: 14.99, currency: "JPY", domain: "https://hbomax.com" },
  { id: "9", name: "Adobe Creative Cloud", price: 52.99, currency: "EUR", domain: "https://adobe.com" },
  { id: "10", name: "Microsoft 365", price: 6.99, currency: "EUR", domain: "https://microsoft.com" }
];
const createCustomStorage = () => {
  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) {
    return {
      getItem: (_key) => null,
      setItem: (_key, _value) => {
      },
      removeItem: (_key) => {
      }
    };
  }
  return localStorage;
};
const useSubscriptionStore = create()(
  persist(
    (set, get) => ({
      subscriptions: defaultSubscriptions,
      addSubscription: (subscription) => set((state) => ({
        subscriptions: [...state.subscriptions, { ...subscription, id: crypto.randomUUID() }]
      })),
      editSubscription: (id, updatedSubscription) => set((state) => ({
        subscriptions: state.subscriptions.map((sub) => sub.id === id ? { ...sub, ...updatedSubscription } : sub)
      })),
      deleteSubscription: (id) => set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id)
      })),
      exportSubscriptions: () => JSON.stringify(get().subscriptions, null, 2),
      importSubscriptions: (data) => {
        try {
          const parsedData = JSON.parse(data);
          if (Array.isArray(parsedData) && parsedData.every(isValidSubscription)) {
            set({ subscriptions: parsedData });
          } else {
            throw new Error("Invalid subscription data format");
          }
        } catch (error) {
          console.error("Failed to import subscriptions:", error);
          throw error;
        }
      },
      resetToDefault: () => set({ subscriptions: defaultSubscriptions })
    }),
    {
      name: "subscription-storage",
      storage: createJSONStorage(() => createCustomStorage()),
      partialize: (state) => ({ subscriptions: state.subscriptions }),
      onRehydrateStorage: () => (state) => {
        var _a;
        if (!state || !((_a = state.subscriptions) == null ? void 0 : _a.length)) {
          useSubscriptionStore.setState({ subscriptions: defaultSubscriptions });
        }
      }
    }
  )
);
function isValidSubscription(sub) {
  return typeof sub === "object" && typeof sub.id === "string" && typeof sub.name === "string" && typeof sub.price === "number" && typeof sub.currency === "string" && typeof sub.domain === "string" && (sub.icon === void 0 || typeof sub.icon === "string");
}
const usePreferencesStore = create()(
  persist(
    (set) => ({
      selectedCurrency: "USD",
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency })
    }),
    {
      name: "preferences-storage"
    }
  )
);
const MAX_HISTORY = 50;
const MAX_SUBS = 200;
function buildSubscriptionsSnapshot(subs) {
  if (!Array.isArray(subs) || subs.length === 0) return [];
  const trim = (s) => typeof s === "string" && s.length > 60 ? s.slice(0, 60) : String(s || "");
  const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
  const first = subs.slice(0, 50).map((s) => ({
    name: trim(s.name),
    amount: round2(s.price),
    currency: String(s.currency || "")
  }));
  if (subs.length <= 50) return first;
  const remainder = subs.slice(50);
  const remainderCurrencies = new Set(remainder.map((s) => String(s.currency || "")));
  if (remainderCurrencies.size > 1) return first;
  const sum = round2(remainder.reduce((acc, s) => acc + (Number(s.price) || 0), 0));
  return [...first, { name: `Other (${remainder.length})`, amount: sum, currency: "[varies]" }];
}
const BASE_SYSTEM_PROMPT = [
  "You are the Subscriptions Dashboard AI assistant for a personal finance app.",
  "Purpose: help the user understand, manage, and optimize their subscriptions within this dashboard.",
  "Behavior:",
  "- Be concise and actionable. When appropriate, use Markdown formatting (bold, lists, tables, code blocks).",
  "- Never claim access to bank accounts, emails, or external services. You only see what the user shares.",
  "- When asked about subscriptions, use the ‘Subscriptions snapshot’ provided in the system context to answer directly. If the snapshot is absent, gracefully state that no subscription data is available.",
  "- Prefer short checklists and clear next steps. Avoid hallucinating subscription entries.",
  "Formatting:",
  "- Use **bold** for key figures, bullet lists for steps, and backticks for short inline terms."
].join("\n");
function Spinner({ className = "h-4 w-4 animate-spin text-muted-foreground" }) {
  return /* @__PURE__ */ jsxs("svg", { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", children: [
    /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
    /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" })
  ] });
}
function SparkleIcon({ className = "h-6 w-6" }) {
  return /* @__PURE__ */ jsx("svg", { className, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { d: "M12 2l1.8 4.6L18 8.4l-4.2 1.8L12 15l-1.8-4.8L6 8.4l4.2-1.8L12 2zM4 14l1.2 3 3 1.2-3 1.2L4 22l-1.2-2.8L0 18.2l2.8-1.2L4 14zm16-2l.9 2.2 2.1.9-2.1.9L20 19l-.9-2.2-2.1-.9 2.1-.9L20 12z" }) });
}
function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2
    }).format(Number(amount) || 0);
  } catch {
    const a = Math.round((Number(amount) || 0) * 100) / 100;
    return `${a} ${currency || "USD"}`;
  }
}
function synthesizeFallbackSuggestions(subsInput, limit = 3) {
  const safeSubs = Array.isArray(subsInput) ? subsInput.slice() : [];
  safeSubs.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  const pick = safeSubs.slice(0, Math.max(0, Math.min(limit, 3)));
  const items = pick.map((s) => ({
    type: "optimize",
    title: `Review ${s.name}`,
    description: `Consider optimizing ${s.name} which costs ${formatAmount(s.price, s.currency)}/mo.`,
    targetIds: [String(s.id)],
    confidence: 0.7,
    actions: []
  }));
  const generics = [
    {
      type: "reminder",
      title: "Track upcoming renewals",
      description: "Review renewal dates and cancel or renegotiate before auto-renewals."
    },
    {
      type: "consolidate",
      title: "Consolidate overlapping tools",
      description: "Identify subscriptions with similar features and consolidate to a single plan."
    },
    {
      type: "optimize",
      title: "Check for student/annual discounts",
      description: "Verify if student, annual, or bundle discounts are available to reduce monthly spend."
    }
  ];
  let idx = 0;
  while (items.length < 3) {
    const g = generics[idx % generics.length];
    items.push({
      type: g.type,
      title: g.title,
      description: g.description,
      targetIds: [],
      confidence: 0.6,
      actions: []
    });
    idx++;
  }
  return items.slice(0, 3);
}
function GeminiAssistant() {
  useNavigate();
  const location = useLocation();
  location.pathname.startsWith("/dashboard");
  const { toast: toast2 } = useToast();
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("chat");
  const fabRef = React.useRef(null);
  const textareaRef = React.useRef(null);
  React.useRef(null);
  const listRef = React.useRef(null);
  const [messages, setMessages] = React.useState([]);
  const [inputText, setInputText] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isThinking, setIsThinking] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [summary, setSummary] = React.useState(void 0);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const subs = useSubscriptionStore((s) => s.subscriptions);
  const selectedCurrency = usePreferencesStore((s) => s.selectedCurrency);
  const locale = React.useMemo(() => {
    if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
    return "en-US";
  }, []);
  const timezone = React.useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return void 0;
    }
  }, []);
  React.useEffect(() => {
    if (open && activeTab === "chat") {
      const id = setTimeout(() => {
        var _a;
        return (_a = textareaRef.current) == null ? void 0 : _a.focus();
      }, 0);
      return () => clearTimeout(id);
    }
  }, [open, activeTab]);
  React.useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);
  React.useEffect(() => {
    if (open && activeTab === "chat") {
      const id = setTimeout(() => {
        const el = listRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      }, 0);
      return () => clearTimeout(id);
    }
  }, [open, activeTab]);
  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) {
      setTimeout(() => {
        var _a;
        return (_a = fabRef.current) == null ? void 0 : _a.focus();
      }, 0);
    }
  };
  const handleKeyDownTextarea = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };
  async function handleSend(promptOverride) {
    var _a, _b, _c;
    if (isSending) return;
    const source = inputText;
    const trimmed = source.trim();
    if (!trimmed) return;
    const userMsg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg].slice(-MAX_HISTORY);
    setMessages(nextMessages);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setIsSending(true);
    setIsThinking(true);
    const context = {
      timezone,
      currency: selectedCurrency || void 0,
      locale
    };
    const subsStatic = typeof (useSubscriptionStore == null ? void 0 : useSubscriptionStore.getState) === "function" ? useSubscriptionStore.getState().subscriptions : subs;
    const snapshot = buildSubscriptionsSnapshot(Array.isArray(subsStatic) ? subsStatic : []);
    const instrParts = [
      BASE_SYSTEM_PROMPT,
      "",
      `User context: locale=${locale || "en-US"}, timezone=${timezone || "unknown"}, defaultCurrency=${selectedCurrency || "USD"}.`,
      `Subscriptions known in client state: ~${Array.isArray(subsStatic) ? subsStatic.length : 0}.`
    ];
    if (snapshot.length > 0) {
      instrParts.push(`Subscriptions snapshot (first ${snapshot.length}):`, "```json", JSON.stringify(snapshot), "```");
    }
    instrParts.push(
      "Always format responses using Markdown (GFM). Use bold for key numbers and bullet lists for steps."
    );
    const systemInstruction = instrParts.join("\n");
    if (typeof process !== "undefined" && ((_a = process.env) == null ? void 0 : _a.NODE_ENV) !== "production") {
      console.debug(
        "[Assistant] snapshot.length=",
        snapshot.length,
        "systemInstruction.length=",
        systemInstruction.length
      );
    }
    const wireMessages = [
      { role: "system", content: systemInstruction },
      ...nextMessages.map((m) => ({ role: m.role, content: m.content }))
    ];
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: wireMessages,
          context
        })
      });
      if (!res.ok) {
        const err = await safeJson(res);
        const msg = err && (((_b = err.error) == null ? void 0 : _b.message) || err.message) || `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      if (((_c = data == null ? void 0 : data.message) == null ? void 0 : _c.role) === "assistant") {
        setMessages((prev) => [...prev, data.message].slice(-MAX_HISTORY));
      } else {
        setMessages(
          (prev) => [...prev, { role: "assistant", content: "I couldn't parse a response." }].slice(-MAX_HISTORY)
        );
      }
    } catch (error) {
      toast2({
        title: "Chat error",
        description: String((error == null ? void 0 : error.message) || "Something went wrong"),
        variant: "destructive"
      });
      setMessages(
        (prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I ran into an error handling that request." }
        ].slice(-MAX_HISTORY)
      );
    } finally {
      setIsSending(false);
      setIsThinking(false);
    }
  }
  React.useCallback(async () => {
    var _a;
    if (isLoadingSuggestions) return;
    setIsLoadingSuggestions(true);
    try {
      const subsArr = Array.isArray(subs) ? subs : [];
      const optimistic = synthesizeFallbackSuggestions(
        subsArr.map((s) => ({
          id: String(s.id),
          name: s.name,
          price: Number(s.price),
          currency: String(s.currency || "")
        })),
        3
      );
      setSuggestions(optimistic);
      setSummary(void 0);
    } catch {
      setSuggestions(synthesizeFallbackSuggestions([], 3));
      setSummary(void 0);
    }
    const sanitized = (Array.isArray(subs) ? subs : []).slice(0, MAX_SUBS).map((s) => ({
      id: String(s.id),
      name: s.name,
      // Store does not have these fields; provide safe defaults
      category: "misc",
      amount: Number(s.price),
      currency: s.currency,
      billingCycle: "monthly",
      nextPaymentDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      // ISO date (YYYY-MM-DD)
      isActive: true
    }));
    const preferences = {
      defaultCurrency: selectedCurrency || void 0,
      savingsGoal: void 0,
      locale,
      timezone
    };
    try {
      const res = await fetch("/api/gemini/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptions: sanitized,
          preferences
        })
      });
      if (!res.ok) {
        const err = await safeJson(res);
        const msg = err && (((_a = err.error) == null ? void 0 : _a.message) || err.message) || `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      const data = await res.json();
      const apiSuggestions = Array.isArray(data == null ? void 0 : data.suggestions) ? data.suggestions : [];
      if (apiSuggestions.length > 0) {
        setSuggestions(apiSuggestions);
        setSummary(data == null ? void 0 : data.summary);
      } else {
        setSummary(void 0);
      }
    } catch (error) {
      toast2({
        title: "Suggestion error",
        description: String((error == null ? void 0 : error.message) || "Failed to generate suggestions"),
        variant: "destructive"
      });
      setSummary(void 0);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [isLoadingSuggestions, subs, selectedCurrency, locale, timezone, toast2]);
  const userBubbleTextClass = "text-primary-foreground";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        ref: fabRef,
        "aria-label": "Open assistant",
        className: "fixed z-[80] rounded-full shadow-lg md:h-12 md:w-12 h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2",
        style: {
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 4.5rem)",
          right: "calc(env(safe-area-inset-right, 0px) + 1rem)"
        },
        onClick: () => setOpen(true),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        },
        variant: "default",
        size: "icon",
        children: [
          /* @__PURE__ */ jsx(SparkleIcon, { className: "h-6 w-6" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open assistant" })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Sheet, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsx(
      SheetContent,
      {
        side: "right",
        role: "dialog",
        "aria-label": "Gemini assistant panel",
        className: "w-full sm:max-w-lg p-0 flex flex-col h-[100dvh]",
        children: /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "sticky top-0 z-10 border-b bg-background/95 px-4 pt-4 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: "Gemini Assistant" }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => setMessages([]),
                  disabled: isSending,
                  title: "Clear chat",
                  children: "Clear"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(Tabs, { defaultValue: "chat", value: activeTab, className: "w-full", children: /* @__PURE__ */ jsx(TabsList, { className: "grid w-full grid-cols-1", children: /* @__PURE__ */ jsx(TabsTrigger, { value: "chat", children: "Chat" }) }) }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 overflow-hidden px-3 pb-3", children: /* @__PURE__ */ jsx(Tabs, { value: activeTab, className: "h-full min-h-0", children: /* @__PURE__ */ jsxs(TabsContent, { value: "chat", className: "mt-2 h-full min-h-0 flex flex-col", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                ref: listRef,
                className: "flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 pr-2",
                "aria-live": "polite",
                "aria-atomic": "false",
                children: [
                  messages.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Start a conversation with the assistant." }) : null,
                  messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    return /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${isUser ? `ml-auto bg-primary ${userBubbleTextClass}` : "mr-auto bg-muted text-foreground"}`,
                        children: isUser ? m.content : /* @__PURE__ */ jsx("div", { className: "text-output text-sm sm:text-base leading-7", children: /* @__PURE__ */ jsx(
                          ReactMarkdown,
                          {
                            remarkPlugins: [remarkGfm],
                            components: {
                              a: ({ node, ...props }) => /* @__PURE__ */ jsx("a", { target: "_blank", rel: "noopener noreferrer", ...props })
                            },
                            children: m.content
                          }
                        ) })
                      },
                      idx
                    );
                  }),
                  /* @__PURE__ */ jsx("div", { className: "h-px" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "mt-2 border-t pt-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
              /* @__PURE__ */ jsx(
                Textarea,
                {
                  ref: textareaRef,
                  value: inputText,
                  onChange: (e) => setInputText(e.target.value),
                  onKeyDown: handleKeyDownTextarea,
                  onInput: (e) => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 240) + "px";
                  },
                  rows: 2,
                  placeholder: "Type a message... (Enter to send, Shift+Enter for newline)",
                  className: "min-h-[44px] max-h-60",
                  disabled: isSending
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "button",
                  onClick: () => void handleSend(),
                  disabled: isSending || !inputText.trim(),
                  className: "h-[44px] px-4",
                  children: isSending ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Spinner, {}),
                    " Sending"
                  ] }) : "Send"
                }
              )
            ] }) })
          ] }) }) })
        ] })
      }
    ) })
  ] });
}
async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold [&+div]:text-xs", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action: action2, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action2,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
async function loader$5() {
  return json({
    ENV: {
      USE_LOCAL_STORAGE: process.env.USE_LOCAL_STORAGE === "true"
    }
  });
}
function App() {
  const data = useLoaderData();
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: 1e3 * 60 * 60 * 24,
          // 1 day
          staleTime: 1e3 * 60 * 60,
          // 1 hour
          refetchOnWindowFocus: false
        }
      }
    })
  );
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx("link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsx("body", { children: /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`
          }
        }
      ),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx(Toaster$1, { duration: 1e3 }),
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(GeminiAssistant, {})
    ] }) })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const CACHE_TTL = 6 * 60 * 60;
let memoryCache = {
  data: null,
  timestamp: 0
};
async function getCurrencyRates(force = false) {
  const now = Date.now();
  if (!force && memoryCache.data && now - memoryCache.timestamp < CACHE_TTL * 1e3) {
    return memoryCache.data;
  }
  try {
    console.info(`[server]: Fetching currency rates at ${/* @__PURE__ */ new Date()}`);
    const response = await fetch(
      "https://api.frankfurter.app/latest?base=USD&symbols=USD,EUR,GBP,JPY,CAD,AUD,INR,CNY,SGD,CHF"
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch currency rates: ${response.statusText}`);
    }
    const data = await response.json();
    data.rates.USD = 1;
    memoryCache = {
      data,
      timestamp: now
    };
    return data;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    return memoryCache.data;
  }
}
function getCacheHeaders$1(timestamp) {
  const lastModified = timestamp ? new Date(timestamp) : /* @__PURE__ */ new Date();
  return {
    "Cache-Control": `public, max-age=${CACHE_TTL}`,
    "Last-Modified": lastModified.toUTCString(),
    Vary: "Accept-Encoding"
  };
}
async function loader$4({ request }) {
  const ifModifiedSince = request.headers.get("If-Modified-Since");
  const data = await getCurrencyRates();
  if (!data) {
    throw new Response("Failed to fetch currency rates", { status: 503 });
  }
  if (ifModifiedSince) {
    const lastModifiedDate = new Date(ifModifiedSince);
    const dataDate = new Date(data.date);
    if (dataDate <= lastModifiedDate) {
      return new Response(null, { status: 304 });
    }
  }
  return json$1(data, {
    headers: getCacheHeaders$1(data.date)
  });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const WINDOW_MS = 6e4;
const LIMIT = 60;
const buckets = /* @__PURE__ */ new Map();
function ipFromRequest(request) {
  var _a, _b, _c, _d;
  const h = request.headers;
  const xff = (_b = (_a = h.get("x-forwarded-for")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim();
  const realIp = (_c = h.get("x-real-ip")) == null ? void 0 : _c.trim();
  const cf = (_d = h.get("cf-connecting-ip")) == null ? void 0 : _d.trim();
  return xff || realIp || cf || "unknown";
}
function rateLimit(request) {
  const ip = ipFromRequest(request);
  const now = Date.now();
  const entry2 = buckets.get(ip);
  if (!entry2 || now >= entry2.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (entry2.count >= LIMIT) {
    return { ok: false, retryAfter: Math.ceil((entry2.resetAt - now) / 1e3) };
  }
  entry2.count += 1;
  return { ok: true };
}
const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, max-age=0"
};
function badRequest(message) {
  return json$1({ error: { code: "BAD_REQUEST", message } }, { status: 400, headers: JSON_HEADERS });
}
function unauthorized(message) {
  return json$1({ error: { code: "UNAUTHORIZED", message } }, { status: 401, headers: JSON_HEADERS });
}
function rateLimited(retryAfter) {
  const headers = { ...JSON_HEADERS };
  if (retryAfter) headers["Retry-After"] = String(retryAfter);
  return json$1({ error: { code: "RATE_LIMITED", message: "Too many requests" } }, { status: 429, headers });
}
function modelError(message) {
  return json$1({ error: { code: "MODEL_ERROR", message } }, { status: 500, headers: JSON_HEADERS });
}
function timeoutError(message) {
  return json$1({ error: { code: "TIMEOUT", message } }, { status: 504, headers: JSON_HEADERS });
}
const MAX_SUBSCRIPTIONS = 200;
function isValidRole(role) {
  return role === "user" || role === "assistant" || role === "system";
}
function sanitizeMessages(input) {
  if (!Array.isArray(input)) return null;
  const capped = input.slice(-50);
  const out = [];
  for (const m of capped) {
    if (!m || typeof m !== "object") continue;
    const role = m.role;
    const content = m.content;
    if (!isValidRole(role)) continue;
    if (typeof content !== "string") continue;
    const trimmed = content.trim();
    if (!trimmed) continue;
    out.push({ role, content: trimmed });
  }
  return out.length > 0 ? out : null;
}
function sanitizeContext(input) {
  if (!input || typeof input !== "object") return void 0;
  const ctx = input;
  const out = {};
  if (typeof ctx.timezone === "string" && ctx.timezone.trim()) out.timezone = ctx.timezone.trim();
  if (typeof ctx.currency === "string" && ctx.currency.trim()) out.currency = ctx.currency.trim();
  if (typeof ctx.locale === "string" && ctx.locale.trim()) out.locale = ctx.locale.trim();
  return Object.keys(out).length ? out : void 0;
}
function sanitizeSubscriptions(input) {
  if (!Array.isArray(input)) return null;
  const capped = input.slice(0, MAX_SUBSCRIPTIONS);
  const out = [];
  for (const it of capped) {
    if (!it || typeof it !== "object") continue;
    const o = it;
    const id = typeof o.id === "string" ? o.id : null;
    const name = typeof o.name === "string" ? o.name : null;
    const category = typeof o.category === "string" ? o.category : null;
    const amount = typeof o.amount === "number" && Number.isFinite(o.amount) ? o.amount : null;
    const currency = typeof o.currency === "string" ? o.currency : null;
    const billingCycle = typeof o.billingCycle === "string" ? o.billingCycle : null;
    const nextPaymentDate = typeof o.nextPaymentDate === "string" ? o.nextPaymentDate : null;
    const isActive = typeof o.isActive === "boolean" ? o.isActive : null;
    if (!id || !name || !category || amount === null || !currency || !billingCycle || !nextPaymentDate || isActive === null) {
      continue;
    }
    out.push({
      id,
      name,
      category,
      amount,
      currency,
      billingCycle,
      nextPaymentDate,
      isActive
    });
  }
  return out.length > 0 ? out : null;
}
function sanitizePreferences(input) {
  if (!input || typeof input !== "object") return void 0;
  const o = input;
  const out = {};
  if (typeof o.defaultCurrency === "string" && o.defaultCurrency.trim()) out.defaultCurrency = o.defaultCurrency.trim();
  if (typeof o.savingsGoal === "number" && Number.isFinite(o.savingsGoal)) out.savingsGoal = o.savingsGoal;
  if (typeof o.locale === "string" && o.locale.trim()) out.locale = o.locale.trim();
  if (typeof o.timezone === "string" && o.timezone.trim()) out.timezone = o.timezone.trim();
  return Object.keys(out).length ? out : void 0;
}
async function action$1({ request, params }) {
  if (request.method !== "POST") {
    return json$1(
      { error: { code: "BAD_REQUEST", message: "Only POST is allowed" } },
      { status: 400, headers: JSON_HEADERS }
    );
  }
  const rl = rateLimit(request);
  if (!rl.ok) return rateLimited(rl.retryAfter);
  const action2 = params.action;
  if (action2 !== "chat" && action2 !== "suggestions") {
    return badRequest("Unknown action");
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }
  let gemini;
  try {
    gemini = await import("./assets/gemini.server-AoCd9PXM.js");
  } catch (e) {
    if (String((e == null ? void 0 : e.message) || "").includes("GEMINI_API_KEY is not set")) {
      return unauthorized("Server configuration missing: GEMINI_API_KEY");
    }
    return modelError((e == null ? void 0 : e.message) || "Failed to initialize Gemini service");
  }
  if (action2 === "chat") {
    const messages = sanitizeMessages(body == null ? void 0 : body.messages);
    const context = sanitizeContext(body == null ? void 0 : body.context);
    if (!messages) return badRequest("messages must be a non-empty array of valid items (max 50)");
    try {
      const result = await gemini.geminiChat(messages, context);
      return json$1(
        {
          message: {
            role: "assistant",
            content: result.message.content,
            ...result.message.annotations ? { annotations: result.message.annotations } : {}
          },
          ...result.usage ? { usage: result.usage } : {}
        },
        { headers: JSON_HEADERS }
      );
    } catch (e) {
      if ((e == null ? void 0 : e.code) === "BAD_REQUEST") return badRequest(e.message || "Invalid chat request");
      if ((e == null ? void 0 : e.code) === "TIMEOUT") return timeoutError("The chat operation timed out");
      return modelError((e == null ? void 0 : e.message) || "Chat model error");
    }
  }
  const subs = sanitizeSubscriptions(body == null ? void 0 : body.subscriptions);
  const prefs = sanitizePreferences(body == null ? void 0 : body.preferences);
  if (!subs) return badRequest("subscriptions must be a non-empty array of valid items (max 200)");
  const sampledAt = (/* @__PURE__ */ new Date()).toISOString();
  try {
    const result = await gemini.geminiSuggestions(subs, prefs, sampledAt);
    return json$1(
      {
        suggestions: result.suggestions,
        ...result.summary ? { summary: result.summary } : {},
        ...result.usage ? { usage: result.usage } : {}
      },
      { headers: JSON_HEADERS }
    );
  } catch (e) {
    if ((e == null ? void 0 : e.code) === "BAD_REQUEST") return badRequest(e.message || "Invalid suggestions request");
    if ((e == null ? void 0 : e.code) === "TIMEOUT") return timeoutError("The suggestions operation timed out");
    return modelError((e == null ? void 0 : e.message) || "Suggestions model error");
  }
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const CONFIG_FILE = path.join(process.cwd(), "/data/config.json");
async function readConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    console.error("Error reading config file:", error);
    return {};
  }
}
async function writeConfig(config) {
  try {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing config file:", error);
  }
}
const loader$3 = async ({ params }) => {
  try {
    const config = await readConfig();
    const key = params.key;
    if (key === void 0) {
      return json$1({ error: "Key is undefined" }, { status: 400 });
    }
    const value = config[key];
    if (value === void 0 && key === "subscription-storage") {
      return json$1({ value: { state: { subscriptions: defaultSubscriptions } } });
    }
    return json$1({ value: value || null });
  } catch (error) {
    console.error("Loader error:", error);
    return json$1({ value: null });
  }
};
const action = async ({ request, params }) => {
  try {
    const key = params.key;
    const config = await readConfig();
    if (key === void 0) {
      return json$1({ error: "Key is undefined" }, { status: 400 });
    }
    if (request.method === "PUT") {
      const { value } = await request.json();
      config[key] = value;
      await writeConfig(config);
      return json$1({ success: true });
    }
    if (request.method === "DELETE") {
      delete config[key];
      await writeConfig(config);
      return json$1({ success: true });
    }
    return json$1({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("Action error:", error);
    return json$1({ error: "Internal Server Error" }, { status: 500 });
  }
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function getCacheHeaders(lastModified) {
  return {
    "Cache-Control": "public, max-age=3600",
    // Cache for 1 hour
    "Last-Modified": lastModified
  };
}
const loader$2 = async ({ request }) => {
  console.debug("Fetching icons data from GitHub API");
  const startTime = Date.now();
  try {
    const ifModifiedSince = request.headers.get("If-Modified-Since");
    const result = await fetch(
      "https://raw.githubusercontent.com/homarr-labs/dashboard-icons/refs/heads/main/tree.json"
    );
    const data = await result.json();
    const lastModified = result.headers.get("Last-Modified") || (/* @__PURE__ */ new Date()).toUTCString();
    if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
      console.debug("Icons data not modified, returning 304");
      return new Response(null, { status: 304 });
    }
    const numberofIcons = data.png.length;
    console.log(`Number of icons: ${numberofIcons}`);
    const icons = data.png.map((icon) => icon.replace(".png", ""));
    const endTime = Date.now();
    console.debug(`Icons data fetched successfully in ${endTime - startTime}ms`);
    return json$1(
      { icons },
      {
        headers: getCacheHeaders(lastModified),
        status: 200
      }
    );
  } catch (error) {
    const endTime = Date.now();
    console.error(`Error fetching icons data in ${endTime - startTime}ms:`, error);
    return json$1({ error: "Error fetching icons" }, { status: 500 });
  }
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function ClientChart(props) {
  const { type, data, options, className } = props;
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  useEffect(() => {
    let isMounted = true;
    async function loadAndRender() {
      var _a;
      const mod = await import("chart.js/auto");
      if (!isMounted) return;
      const ChartAuto = mod.default;
      const ctx = (_a = canvasRef.current) == null ? void 0 : _a.getContext("2d");
      if (!ctx) return;
      const mergedOptions = Object.assign({ maintainAspectRatio: false }, options);
      chartRef.current = new ChartAuto(ctx, {
        type,
        data,
        options: mergedOptions
      });
    }
    loadAndRender();
    return () => {
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [type, data, options]);
  return /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className, role: "img", "aria-label": "chart" });
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
function lastSixMonthLabels() {
  const labels = [];
  const ref = /* @__PURE__ */ new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const label = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    labels.push(label);
  }
  return labels;
}
function DashboardCharts() {
  const { rates } = useLoaderData();
  const { selectedCurrency } = usePreferencesStore();
  const subscriptionData = [
    { name: "Netflix", amount: 649 },
    { name: "Spotify", amount: 119 },
    { name: "Adobe CC", amount: 1599 },
    { name: "GitHub", amount: 400 },
    { name: "Google One", amount: 650 }
  ];
  const conversionFactor = React.useMemo(() => {
    if (!rates) return 1;
    const inr = rates["INR"];
    const target = rates[selectedCurrency] || 1;
    if (!inr || !target) return 1;
    return target / inr;
  }, [rates, selectedCurrency]);
  const formatCurrency = React.useCallback(
    (value) => {
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: selectedCurrency,
          maximumFractionDigits: 0
        }).format(value);
      } catch {
        return `${selectedCurrency} ${value}`;
      }
    },
    [selectedCurrency]
  );
  const pieLabels = subscriptionData.map((s) => s.name);
  const pieValuesConverted = subscriptionData.map((s) => s.amount * conversionFactor);
  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        label: "Monthly Expense",
        data: pieValuesConverted,
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"],
        hoverOffset: 8
      }
    ]
  };
  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 16, boxHeight: 16 }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const raw = Number(ctx.parsed);
            return `${ctx.label}: ${formatCurrency(raw)}`;
          }
        }
      }
    }
  };
  const barLabels = lastSixMonthLabels();
  const barValuesINR = [4200, 4380, 4120, 4590, 4720, 4610];
  const barValuesConverted = barValuesINR.map((v) => v * conversionFactor);
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: "Total per month",
        data: barValuesConverted,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.6
      }
    ]
  };
  const barOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const raw = Number(ctx.parsed.y);
            return ` ${formatCurrency(raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.2)" },
        ticks: {
          callback: (value) => {
            const n = Number(value);
            return formatCurrency(n);
          }
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxs(Card, { className: "h-[380px]", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Monthly expenses by subscription" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "h-[300px]", children: /* @__PURE__ */ jsx(ClientChart, { type: "pie", data: pieData, options: pieOptions, className: "h-full w-full" }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "h-[380px]", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Total cost per month (last 6 months)" }) }),
      /* @__PURE__ */ jsx(CardContent, { className: "h-[300px]", children: /* @__PURE__ */ jsx(ClientChart, { type: "bar", data: barData, options: barOptions, className: "h-full w-full" }) })
    ] })
  ] });
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  PopoverPrimitive.Content,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(CaretSortIcon, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUpIcon, {})
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDownIcon, {})
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Dialog = SheetPrimitive.Root;
const DialogPortal = SheetPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Cross2Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = SheetPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = SheetPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = SheetPrimitive.Description.displayName;
function IconUrlInput({
  value,
  onChange,
  id = "icon",
  label = "Icon URL",
  error = false,
  placeholder = "Enter icon URL or search"
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const inputRef = React.useRef(null);
  const { data: icons, isLoading } = useQuery({
    queryKey: ["Icons"],
    queryFn: async () => {
      const response = await fetch("/api/icons");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }
  });
  const options = React.useMemo(
    () => (icons == null ? void 0 : icons.icons.map((icon) => ({
      label: icon,
      value: `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/${icon}.png`
    }))) || [],
    [icons]
  );
  const filteredIcons = React.useMemo(
    () => searchQuery === "" ? options : options.filter(
      (icon) => icon.label.toLowerCase().replace(/\s+/g, "").includes(searchQuery.toLowerCase().replace(/\s+/g, ""))
    ),
    [options, searchQuery]
  );
  const handleSelect = (icon) => {
    onChange(icon.value);
    setOpen(false);
  };
  const isValidIconUrl = React.useMemo(() => {
    if (!value) return false;
    try {
      return Boolean(new URL(value));
    } catch {
      return false;
    }
  }, [value]);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    label && /* @__PURE__ */ jsx(Label, { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "relative flex-1", children: /* @__PURE__ */ jsx(
        Input,
        {
          ref: inputRef,
          id,
          value,
          onChange: (e) => onChange(e.target.value),
          placeholder,
          className: error ? "border-red-500" : ""
        }
      ) }),
      /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", size: "icon", onClick: () => setOpen(true), title: "Search for icons", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Search icons" })
      ] }),
      isValidIconUrl && /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-background", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: value,
          alt: "Icon preview",
          className: "h-6 w-6 object-contain",
          onError: (e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlLW9mZiI+PHBhdGggZD0iTTE4IDExdl0iLz48cGF0aCBkPSJtOS41IDE3LjVMNiAxNCIvPjxwYXRoIGQ9Im0xNCA2LTQuNSA0LjUiLz48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iMiIvPjxwb2x5Z29uIHBvaW50cz0iMTYgMTEgMTMgMTQgMTYgMTcgMTkgMTQiLz48cGF0aCBkPSM2IDIgSCAxOGM1IDAgNSA4IDAgOCIvPjxwYXRoIGQ9Ik0zIDEzLjJBOC4xIDguMSAwIDAgMCA4IDIyIi8+PHBhdGggZD0iTTIxIDl2OGEyIDIgMCAwIDEtMiAyaC04Ii8+PC9zdmc+";
          }
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[700px]", children: [
      /* @__PURE__ */ jsx(DialogTitle, { children: "Select Icon" }),
      /* @__PURE__ */ jsxs("div", { className: "relative my-4", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            placeholder: "Search icons...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-8",
            autoFocus: true
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-10", children: /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : filteredIcons.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-10", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-12 w-12 text-muted-foreground" }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-muted-foreground", children: "No icons found. Try a different search term." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid h-[450px] grid-cols-8 gap-3 overflow-y-auto", children: filteredIcons.map((icon) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSelect(icon),
          type: "button",
          "aria-label": `Select ${icon.label} icon`,
          className: `flex cursor-pointer flex-col items-center justify-center rounded-md p-2 transition-colors hover:bg-accent ${value === icon.value ? "bg-accent" : ""}`,
          children: [
            /* @__PURE__ */ jsx("img", { src: icon.value, alt: icon.label, width: 32, height: 32 }),
            /* @__PURE__ */ jsx("span", { className: "mt-1 max-w-full truncate text-xs", children: icon.label })
          ]
        },
        icon.value
      )) })
    ] }) })
  ] });
}
const subscriptionSchema$1 = z$1.object({
  name: z$1.string().min(1, "Name is required"),
  price: z$1.number().min(0.01, "Price must be greater than 0"),
  currency: z$1.string().min(1, "Currency is required"),
  icon: z$1.string().optional(),
  domain: z$1.string().url("Invalid URL")
});
const AddSubscriptionPopover = ({ addSubscription }) => {
  var _a, _b, _c, _d;
  const { rates } = useLoaderData();
  const [open, setOpen] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(subscriptionSchema$1),
    defaultValues: {
      name: "",
      icon: "",
      price: 0,
      currency: "USD",
      domain: ""
    }
  });
  const iconValue = watch("icon");
  useEffect(() => {
    if (shouldFocus) {
      setFocus("name");
      setShouldFocus(false);
    }
  }, [shouldFocus, setFocus]);
  const onSubmit = (data) => {
    addSubscription(data);
    toast$1.success(`${data.name} added successfully.`);
    reset();
    setShouldFocus(true);
  };
  useEffect(() => {
    if (open) {
      setFocus("name");
    }
  }, [open, setFocus]);
  return /* @__PURE__ */ jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
      /* @__PURE__ */ jsx(PlusCircle, { className: "mr-2 h-4 w-4" }),
      "Add Subscription"
    ] }) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-80", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [
      /* @__PURE__ */ jsx("h3", { className: "font-medium text-lg mb-4", children: "Add Subscription" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          IconUrlInput,
          {
            value: iconValue || "",
            onChange: (value) => setValue("icon", value),
            label: "Icon (optional)",
            error: !!errors.icon
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
          /* @__PURE__ */ jsx(Input, { required: true, id: "name", ...register("name"), className: errors.name ? "border-red-500" : "" }),
          /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs h-4", children: (_a = errors.name) == null ? void 0 : _a.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "price", children: "Price" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "price",
                type: "number",
                ...register("price", {
                  valueAsNumber: true
                }),
                className: errors.price ? "border-red-500" : ""
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs h-4", children: (_b = errors.price) == null ? void 0 : _b.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "currency", children: "Currency" }),
            /* @__PURE__ */ jsxs(Select, { onValueChange: (value) => setValue("currency", value), defaultValue: "USD", children: [
              /* @__PURE__ */ jsx(SelectTrigger, { id: "currency", className: errors.currency ? "border-red-500" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select currency" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(rates ?? []).map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c)) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs h-4", children: (_c = errors.currency) == null ? void 0 : _c.message })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "domain", children: "Domain" }),
          /* @__PURE__ */ jsx(Input, { id: "domain", ...register("domain"), className: errors.domain ? "border-red-500" : "" }),
          /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs h-4", children: (_d = errors.domain) == null ? void 0 : _d.message })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ jsx(Button, { type: "submit", className: "contain-content", children: "Save" }) })
    ] }) })
  ] });
};
const Header = () => {
  const { addSubscription } = useSubscriptionStore();
  const location = useLocation();
  const onDashboard = location.pathname.startsWith("/dashboard");
  return /* @__PURE__ */ jsx("header", { className: "p-4 shadow-md bg-muted", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex justify-between items-center", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "LedgerLeaf" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Track and manage recurring subscriptions." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      onDashboard ? /* @__PURE__ */ jsx(
        NavLink,
        {
          to: "/",
          prefetch: "intent",
          className: ({ isActive }) => [
            "px-3 py-2 text-sm font-medium transition-colors rounded-md",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          ].join(" "),
          "aria-label": "Go to Home",
          children: "Home"
        }
      ) : /* @__PURE__ */ jsx(
        NavLink,
        {
          to: "/dashboard",
          prefetch: "intent",
          className: ({ isActive }) => [
            "px-3 py-2 text-sm font-medium transition-colors rounded-md",
            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
          ].join(" "),
          "aria-label": "Go to Dashboard",
          children: "Dashboard"
        }
      ),
      /* @__PURE__ */ jsx(AddSubscriptionPopover, { addSubscription })
    ] })
  ] }) });
};
const meta$1 = () => {
  return [
    { title: "Dashboard | Subscriptions" },
    { name: "description", content: "Visualize subscription spending and monthly totals." }
  ];
};
async function loader$1({ request }) {
  const data = await getCurrencyRates();
  return json$1(
    {
      rates: (data == null ? void 0 : data.rates) ?? null,
      lastUpdated: (data == null ? void 0 : data.date) ?? null
    },
    {
      headers: getCacheHeaders$1(data == null ? void 0 : data.date)
    }
  );
}
function DashboardRoute() {
  const { rates } = useLoaderData();
  const { selectedCurrency, setSelectedCurrency } = usePreferencesStore();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto py-6 px-3 sm:px-4 lg:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground mb-1", children: "Dashboard" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Visualize subscription spending and monthly totals" })
        ] }),
        rates ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(Select, { value: selectedCurrency, onValueChange: setSelectedCurrency, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[96px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Currency" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(rates).map((currency) => /* @__PURE__ */ jsx(SelectItem, { value: currency, children: currency }, currency)) })
        ] }) }) : null
      ] }),
      /* @__PURE__ */ jsx(DashboardCharts, {})
    ] })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DashboardRoute,
  loader: loader$1,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  subscriptionName
}) => {
  return /* @__PURE__ */ jsx(AlertDialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
    /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
      /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Are you sure?" }),
      /* @__PURE__ */ jsxs(AlertDialogDescription, { children: [
        "This action cannot be undone. This will permanently delete the subscription for ",
        subscriptionName,
        " from your account."
      ] })
    ] }),
    /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
      /* @__PURE__ */ jsx(AlertDialogCancel, { onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsx(AlertDialogAction, { onClick: onConfirm, children: "Delete" })
    ] })
  ] }) });
};
const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  layout = "fixed",
  isStatic = false,
  imageSrc = ""
}) => {
  let src;
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 3,
      "viewport.height": height * 3
    });
    src = `https://api.microlink.io/?${params}`;
  } else {
    src = imageSrc;
  }
  const [isOpen, setOpen] = React__default.useState(false);
  const [isMounted, setIsMounted] = React__default.useState(false);
  React__default.useEffect(() => {
    setIsMounted(true);
  }, []);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);
  const handleMouseMove = (event) => {
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isMounted ? /* @__PURE__ */ jsx("div", { className: "hidden", children: /* @__PURE__ */ jsx(
      "img",
      {
        src,
        width,
        height,
        alt: "hidden image"
      }
    ) }) : null,
    /* @__PURE__ */ jsxs(
      HoverCardPrimitive.Root,
      {
        openDelay: 50,
        closeDelay: 100,
        onOpenChange: (open) => {
          setOpen(open);
        },
        children: [
          /* @__PURE__ */ jsx(
            HoverCardPrimitive.Trigger,
            {
              onMouseMove: handleMouseMove,
              className: cn("text-black dark:text-white", className),
              href: url,
              children
            }
          ),
          /* @__PURE__ */ jsx(
            HoverCardPrimitive.Content,
            {
              className: "[transform-origin:var(--radix-hover-card-content-transform-origin)]",
              side: "top",
              align: "center",
              sideOffset: 10,
              children: /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { opacity: 0, y: 20, scale: 0.6 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }
                  },
                  exit: { opacity: 0, y: 20, scale: 0.6 },
                  className: "shadow-xl rounded-xl",
                  style: {
                    x: translateX
                  },
                  children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: url,
                      target: "_blank",
                      className: "block p-1 bg-black border-2 border-transparent shadow rounded-xl hover:border-neutral-200 dark:hover:border-neutral-800",
                      style: { fontSize: 0 },
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: isStatic ? imageSrc : src,
                          width,
                          height,
                          className: "rounded-lg",
                          alt: "preview image"
                        }
                      )
                    }
                  )
                }
              ) })
            }
          )
        ]
      }
    )
  ] });
};
const SubscriptionCard = ({ subscription, onEdit, onDelete, className }) => {
  const { id, name, price, currency, domain, icon } = subscription;
  const sanitizeDomain = (domain2) => {
    try {
      return new URL(domain2).href;
    } catch {
      return new URL(`https://${domain2}`).href;
    }
  };
  const sanitizedDomain = sanitizeDomain(domain);
  const defaultLogoUrl = `https://www.google.com/s2/favicons?domain=${sanitizedDomain}&sz=64`;
  const logoUrl = icon || defaultLogoUrl;
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      whileHover: { scale: 1.03 },
      whileTap: { scale: 0.98 },
      transition: { type: "spring", stiffness: 300, damping: 20 },
      className: `group ${className}`,
      children: /* @__PURE__ */ jsxs(Card, { className: "bg-card hover:bg-card/80 transition-all duration-200 shadow-md hover:shadow-lg relative h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2", children: [
          /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "icon", onClick: () => onEdit(id), className: "bg-background hover:bg-muted", children: [
            /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Edit" })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: () => onDelete(id),
              className: "bg-background hover:bg-muted text-destructive hover:text-destructive/80",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Delete" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(LinkPreview, { url: sanitizedDomain, children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center p-4 sm:p-6 h-full", children: [
          /* @__PURE__ */ jsx("img", { src: logoUrl, alt: `${name} logo`, className: "w-16 h-16 mb-3 rounded-full shadow-md" }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl sm:text-1xl font-bold mb-2 text-card-foreground max-w-full text-wrap-balance overflow-wrap-break-word line-clamp-1 text-center", children: name }),
          /* @__PURE__ */ jsx("p", { className: "text-md sm:text-sm font-semibold text-card-foreground text-center", children: `${currency} ${price}` })
        ] }) })
      ] })
    }
  );
};
const subscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  domain: z.string().url("Invalid URL"),
  icon: z.string().optional()
});
const EditSubscriptionModal = ({
  isOpen,
  onClose,
  onSave,
  editingSubscription
}) => {
  var _a, _b, _c, _d;
  const { rates } = useLoaderData();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      price: 0,
      currency: "USD",
      domain: "",
      icon: ""
    }
  });
  useEffect(() => {
    if (editingSubscription) {
      reset(editingSubscription);
    } else {
      reset({
        name: "",
        price: 0,
        currency: "USD",
        domain: "",
        icon: ""
      });
    }
  }, [editingSubscription, reset]);
  const watchedFields = watch();
  const previewSubscription = {
    id: "preview",
    name: watchedFields.name || "Example Subscription",
    price: watchedFields.price || 0,
    currency: watchedFields.currency || "USD",
    domain: watchedFields.domain || "https://example.com",
    icon: watchedFields.icon
  };
  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };
  return /* @__PURE__ */ jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[600px] lg:max-w-[800px]", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: editingSubscription ? "Edit Subscription" : "Add Subscription" }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            IconUrlInput,
            {
              value: watchedFields.icon || "",
              onChange: (value) => setValue("icon", value),
              label: "Icon (optional)",
              error: !!errors.icon
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
            /* @__PURE__ */ jsx(
              Controller,
              {
                name: "name",
                control,
                render: ({ field }) => /* @__PURE__ */ jsx(Input, { id: "name", ...field, className: errors.name ? "border-red-500" : "" })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs h-4", children: ((_a = errors.name) == null ? void 0 : _a.message) || " " })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "price", children: "Price" }),
                /* @__PURE__ */ jsx(
                  Controller,
                  {
                    name: "price",
                    control,
                    render: ({ field }) => /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "price",
                        type: "number",
                        ...field,
                        onChange: (e) => field.onChange(Number.parseFloat(e.target.value)),
                        className: errors.price ? "border-red-500" : ""
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "currency", children: "Currency" }),
                /* @__PURE__ */ jsx(
                  Controller,
                  {
                    name: "currency",
                    control,
                    render: ({ field }) => /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                      /* @__PURE__ */ jsx(SelectTrigger, { id: "currency", className: errors.currency ? "border-red-500" : "", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select currency" }) }),
                      /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(rates ?? []).map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c, children: c }, c)) })
                    ] })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs h-4", children: ((_b = errors.price) == null ? void 0 : _b.message) || ((_c = errors.currency) == null ? void 0 : _c.message) || " " })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "domain", children: "Domain" }),
            /* @__PURE__ */ jsx(
              Controller,
              {
                name: "domain",
                control,
                render: ({ field }) => /* @__PURE__ */ jsx(Input, { id: "domain", ...field, className: errors.domain ? "border-red-500" : "" })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs h-4", children: ((_d = errors.domain) == null ? void 0 : _d.message) || " " })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "my-auto", children: /* @__PURE__ */ jsx(SubscriptionCard, { subscription: previewSubscription, onEdit: () => {
        }, onDelete: () => {
        } }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end mt-4 gap-2", children: [
        /* @__PURE__ */ jsx(Button, { type: "button", variant: "secondary", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { type: "submit", className: "contain-content", children: "Save" }) })
      ] })
    ] })
  ] }) });
};
const SearchBar = ({ onSearch }) => {
  return /* @__PURE__ */ jsxs("div", { className: "relative rounded-lg bg-card", children: [
    /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" }),
    /* @__PURE__ */ jsx(
      Input,
      {
        type: "text",
        placeholder: "Search subscriptions...",
        autoFocus: true,
        className: "pl-10 pr-4 py-2 w-full",
        onChange: (e) => onSearch(e.target.value)
      }
    )
  ] });
};
const SubscriptionGrid = ({
  subscriptions,
  onEditSubscription,
  onDeleteSubscription
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: [
    /* @__PURE__ */ jsx(AnimatePresence, { children: subscriptions.map((subscription) => /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsx(
          SubscriptionCard,
          {
            subscription,
            onEdit: () => onEditSubscription(subscription.id),
            onDelete: () => onDeleteSubscription(subscription.id)
          }
        )
      },
      subscription.id
    )) }),
    subscriptions.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full text-center py-8", children: /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground", children: "No subscriptions found. Add one to get started!" }) })
  ] });
};
function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 25,
    stiffness: 100,
    duration: 0.4
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });
  useEffect(() => {
    isInView && setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : value);
    }, delay * 1e3);
  }, [motionValue, isInView, delay, value, direction]);
  useEffect(
    () => springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces
        }).format(Number(latest.toFixed(decimalPlaces)));
      }
    }),
    [springValue, decimalPlaces]
  );
  return /* @__PURE__ */ jsx("span", { className: cn("inline-block tabular-nums text-black dark:text-white tracking-wider", className), ref });
}
const Summary = ({ totals }) => {
  const { selectedCurrency, setSelectedCurrency } = usePreferencesStore();
  const { lastUpdated, rates } = useLoaderData();
  if (!rates || !lastUpdated) {
    return null;
  }
  const calculateTotal = () => {
    const totalUSD = Object.entries(totals).reduce((acc, [currency, amount]) => {
      return acc + amount / (rates[currency] || 1);
    }, 0);
    return totalUSD * (rates[selectedCurrency] || 1);
  };
  const convertedTotal = calculateTotal();
  return /* @__PURE__ */ jsx(Card, { className: "mb-6 bg-card shadow-lg", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 sm:p-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl font-bold mb-4 text-foreground", children: "Summary" }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 sm:gap-4", children: Object.entries(totals).map(([currency, total]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-muted rounded-lg p-2 sm:p-3 shadow-sm", children: [
      /* @__PURE__ */ jsxs("span", { className: "font-semibold mr-1 text-muted-foreground text-sm", children: [
        currency,
        ":"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg font-bold text-foreground", children: total.toFixed(0) })
    ] }, currency)) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-foreground", children: "Total" }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground", children: [
          "Rates for: ",
          new Date(lastUpdated).toLocaleDateString()
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(
          NumberTicker,
          {
            decimalPlaces: 2,
            value: convertedTotal,
            className: "text-xl sm:text-2xl font-bold text-foreground mr-2"
          }
        ),
        /* @__PURE__ */ jsxs(Select, { value: selectedCurrency, onValueChange: setSelectedCurrency, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[80px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Currency" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: Object.keys(rates).map((currency) => /* @__PURE__ */ jsx(SelectItem, { value: currency, children: currency }, currency)) })
        ] })
      ] })
    ] }) })
  ] }) });
};
const meta = () => {
  return [
    { title: "LedgerLeaf - Subscription Tracker" },
    { name: "description", content: "Track and manage recurring subscriptions." }
  ];
};
async function loader({ request }) {
  const data = await getCurrencyRates();
  return json$1(
    {
      rates: (data == null ? void 0 : data.rates) ?? null,
      lastUpdated: (data == null ? void 0 : data.date) ?? null
    },
    {
      headers: getCacheHeaders$1(data == null ? void 0 : data.date)
    }
  );
}
function Index() {
  const { rates, lastUpdated } = useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const {
    subscriptions,
    addSubscription,
    editSubscription,
    deleteSubscription,
    exportSubscriptions,
    importSubscriptions
  } = useSubscriptionStore();
  const calculateTotalsInUSD = () => {
    if (!rates) return {};
    return subscriptions.reduce(
      (acc, sub) => {
        const currency = sub.currency;
        rates[currency] || 1;
        acc[currency] = (acc[currency] || 0) + sub.price;
        return acc;
      },
      {}
    );
  };
  const handleEditSubscription = (id) => {
    const subscription = subscriptions.find((sub) => sub.id === id);
    if (subscription) {
      setEditingSubscription(subscription);
      setIsModalOpen(true);
    }
  };
  const handleDeleteSubscription = (id) => {
    const subscription = subscriptions.find((sub) => sub.id === id);
    if (subscription) {
      setSubscriptionToDelete(subscription);
      setIsDeleteDialogOpen(true);
    }
  };
  const confirmDelete = () => {
    if (subscriptionToDelete) {
      deleteSubscription(subscriptionToDelete.id);
      toast$1.success("Subscription deleted successfully.");
      setIsDeleteDialogOpen(false);
      setSubscriptionToDelete(null);
    }
  };
  const handleSaveSubscription = (subscription) => {
    try {
      if (editingSubscription) {
        editSubscription(editingSubscription.id, subscription);
        toast$1.success(`${subscription.name} updated successfully.`);
      } else {
        addSubscription(subscription);
        toast$1.success(`${subscription.name} added successfully.`);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast$1.error("Failed to save subscription. Please try again.");
    }
  };
  const handleExport = async () => {
    try {
      const data = await exportSubscriptions();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "subscriptions.json";
      a.click();
      URL.revokeObjectURL(url);
      toast$1.success(`${subscriptions.length} subscriptions exported successfully.`);
    } catch (error) {
      console.error("Export failed:", error);
      toast$1.error("Failed to export subscriptions. Please try again.");
    }
  };
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleImport = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        var _a2;
        try {
          const content = (_a2 = e.target) == null ? void 0 : _a2.result;
          importSubscriptions(content);
          toast$1.success("Subscriptions imported successfully.");
        } catch (error) {
          console.error("Import failed:", error);
          toast$1.error("Failed to import subscriptions. Please check the file and try again.");
        }
      };
      reader.readAsText(file);
    }
  };
  const filteredSubscriptions = subscriptions.filter(
    (sub) => sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || sub.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto py-6 px-3 sm:px-4 lg:px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6 flex flex-col sm:flex-row justify-between items-center", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-foreground mb-1", children: [
          "Manage ",
          subscriptions.length,
          " Subscriptions"
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleExport,
              size: "sm",
              variant: "outline",
              className: "rounded-none rounded-tl-md rounded-bl-md ",
              children: [
                /* @__PURE__ */ jsx(Download, { className: "mr-1 h-3 w-3" }),
                "Export"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleImportClick,
              size: "sm",
              variant: "outline",
              className: "rounded-none rounded-tr-md rounded-br-md ",
              children: [
                /* @__PURE__ */ jsx(Upload, { className: "mr-1 h-3 w-3" }),
                "Import"
              ]
            }
          ),
          /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", accept: ".json", className: "hidden", onChange: handleImport })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Summary, { totals: calculateTotalsInUSD() }),
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(SearchBar, { onSearch: setSearchQuery }) }),
      /* @__PURE__ */ jsx(
        SubscriptionGrid,
        {
          subscriptions: filteredSubscriptions,
          onEditSubscription: handleEditSubscription,
          onDeleteSubscription: handleDeleteSubscription
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      EditSubscriptionModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        onSave: handleSaveSubscription,
        editingSubscription
      }
    ),
    /* @__PURE__ */ jsx(
      DeleteConfirmationDialog,
      {
        isOpen: isDeleteDialogOpen,
        onClose: () => setIsDeleteDialogOpen(false),
        onConfirm: confirmDelete,
        subscriptionName: (subscriptionToDelete == null ? void 0 : subscriptionToDelete.name) || ""
      }
    )
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Cm8kM-oJ.js", "imports": ["/assets/utils-BxSkdMMe.js", "/assets/index-DUQ9hqCk.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BuuEc16s.js", "imports": ["/assets/utils-BxSkdMMe.js", "/assets/index-DUQ9hqCk.js", "/assets/preferences-ztP-82l4.js"], "css": ["/assets/root-CqeV16ox.css"] }, "routes/api.currency-rates": { "id": "routes/api.currency-rates", "parentId": "root", "path": "api/currency-rates", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.currency-rates-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.gemini.$action": { "id": "routes/api.gemini.$action", "parentId": "root", "path": "api/gemini/:action", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.gemini._action-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.storage.$key": { "id": "routes/api.storage.$key", "parentId": "root", "path": "api/storage/:key", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.storage._key-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api.icons": { "id": "routes/api.icons", "parentId": "root", "path": "api/icons", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.icons-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/dashboard": { "id": "routes/dashboard", "parentId": "root", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard-Cg8iJlZo.js", "imports": ["/assets/utils-BxSkdMMe.js", "/assets/Header-FKyU_VHQ.js", "/assets/preferences-ztP-82l4.js", "/assets/index-DUQ9hqCk.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BhCY6D05.js", "imports": ["/assets/utils-BxSkdMMe.js", "/assets/preferences-ztP-82l4.js", "/assets/Header-FKyU_VHQ.js", "/assets/index-DUQ9hqCk.js"], "css": [] } }, "url": "/assets/manifest-301e915e.js", "version": "301e915e" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.currency-rates": {
    id: "routes/api.currency-rates",
    parentId: "root",
    path: "api/currency-rates",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/api.gemini.$action": {
    id: "routes/api.gemini.$action",
    parentId: "root",
    path: "api/gemini/:action",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/api.storage.$key": {
    id: "routes/api.storage.$key",
    parentId: "root",
    path: "api/storage/:key",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/api.icons": {
    id: "routes/api.icons",
    parentId: "root",
    path: "api/icons",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
