"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Trash2, Plus, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n-context";

interface Address {
  id: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryNotes: string;
}

interface OrderItem {
  id: string;
  productName: string;
  orderType: string;
  frequency: string | null;
  amount: number;
  status: string;
  createdAt: string;
}

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AccountPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    deliveryNotes: "",
  });

  useEffect(() => {
    fetch("/api/account/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.profile);
        setAddresses(data.addresses);
        setOrders(data.orders);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profile.name, phone: profile.phone }),
      });
      if (res.ok) {
        toast.success(t("account.saved"));
      }
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  const addAddress = async () => {
    if (!newAddress.address || !newAddress.city || !newAddress.postalCode) return;
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      if (res.ok) {
        const addr = await res.json();
        setAddresses((prev) => [addr, ...prev]);
        setNewAddress({ address: "", city: "", postalCode: "", deliveryNotes: "" });
        setShowAddAddress(false);
        toast.success(t("account.saved"));
      }
    } catch {
      toast.error("Failed to add address");
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8 space-y-8">
      <h1 className="text-xl font-semibold">{t("account.title")}</h1>

      {/* Profile */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold">1</span>
          {t("account.profile")}
        </h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <Label>{t("checkout.fullName")}</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("checkout.email")}</Label>
              <Input value={profile.email} disabled className="opacity-60" />
            </div>
            <div className="space-y-1.5">
              <Label>{t("checkout.phone")}</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <Button onClick={saveProfile} disabled={saving} size="sm">
              {saving && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              {t("account.saveChanges")}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Addresses */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold">2</span>
            {t("account.addresses")}
          </h2>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setShowAddAddress(!showAddAddress)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {t("account.addAddress")}
          </Button>
        </div>

        {showAddAddress && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1.5">
                <Label>{t("checkout.address")}</Label>
                <Input
                  value={newAddress.address}
                  onChange={(e) => setNewAddress((p) => ({ ...p, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>{t("checkout.city")}</Label>
                  <Input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("checkout.postalCode")}</Label>
                  <Input
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress((p) => ({ ...p, postalCode: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>{t("checkout.deliveryNotes")} <span className="text-[var(--muted-foreground)]">{t("checkout.deliveryNotesOptional")}</span></Label>
                <Textarea
                  value={newAddress.deliveryNotes}
                  onChange={(e) => setNewAddress((p) => ({ ...p, deliveryNotes: e.target.value }))}
                  placeholder={t("checkout.deliveryNotesPlaceholder")}
                />
              </div>
              <Button size="sm" onClick={addAddress}>
                {t("account.addAddress")}
              </Button>
            </CardContent>
          </Card>
        )}

        {addresses.length === 0 && !showAddAddress ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-[var(--muted-foreground)]">
              <MapPin className="h-5 w-5 mx-auto mb-2 opacity-40" />
              {t("account.noAddresses")}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {addresses.map((addr) => (
              <Card key={addr.id}>
                <CardContent className="p-4 flex items-start justify-between">
                  <div className="text-sm">
                    <div className="font-medium">{addr.address}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {addr.city}, {addr.postalCode}
                    </div>
                    {addr.deliveryNotes && (
                      <div className="text-xs text-[var(--muted-foreground)] mt-1 italic">
                        {addr.deliveryNotes}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-red-500 hover:text-red-700 shrink-0"
                    onClick={() => deleteAddress(addr.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Order History */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold">3</span>
          {t("account.orders")}
        </h2>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-sm text-[var(--muted-foreground)]">
              <Package className="h-5 w-5 mx-auto mb-2 opacity-40" />
              {t("account.noOrders")}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{order.productName}</span>
                    <Badge className={`text-[10px] ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span>
                      {order.orderType === "SUBSCRIPTION" ? `${order.frequency} subscription` : "One-time"}
                      {" · "}
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </span>
                    <span className="font-medium text-[var(--foreground)]">{formatPrice(order.amount)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
