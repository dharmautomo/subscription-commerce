import { prisma } from "@/lib/db";
import type { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters";

export function CustomerAdapter(): Adapter {
  return {
    async createUser(data) {
      const customer = await prisma.customer.create({
        data: {
          name: data.name ?? "",
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image,
        },
      });
      return mapCustomerToUser(customer);
    },

    async getUser(id) {
      const customer = await prisma.customer.findUnique({ where: { id } });
      return customer ? mapCustomerToUser(customer) : null;
    },

    async getUserByEmail(email) {
      const customer = await prisma.customer.findUnique({ where: { email } });
      return customer ? mapCustomerToUser(customer) : null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });
      return account?.user ? mapCustomerToUser(account.user) : null;
    },

    async updateUser(data) {
      const customer = await prisma.customer.update({
        where: { id: data.id },
        data: {
          name: data.name ?? undefined,
          email: data.email ?? undefined,
          emailVerified: data.emailVerified ?? undefined,
          image: data.image ?? undefined,
        },
      });
      return mapCustomerToUser(customer);
    },

    async linkAccount(data) {
      await prisma.account.create({
        data: {
          userId: data.userId,
          type: data.type,
          provider: data.provider,
          providerAccountId: data.providerAccountId,
          refresh_token: data.refresh_token,
          access_token: data.access_token,
          expires_at: data.expires_at,
          token_type: data.token_type,
          scope: data.scope,
          id_token: data.id_token,
          session_state: data.session_state as string | undefined,
        },
      });
      return data as AdapterAccount;
    },

    async createVerificationToken(data) {
      const token = await prisma.verificationToken.create({ data });
      return token;
    },

    async useVerificationToken({ identifier, token }) {
      try {
        const vt = await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token } },
        });
        return vt;
      } catch {
        return null;
      }
    },

    // Not needed for JWT strategy but required by interface
    async deleteUser(id) {
      await prisma.customer.delete({ where: { id } });
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
    },
    async createSession() { return null as any; },
    async getSessionAndUser() { return null; },
    async updateSession() { return null as any; },
    async deleteSession() {},
  };
}

function mapCustomerToUser(customer: {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
}): AdapterUser {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    emailVerified: customer.emailVerified,
    image: customer.image,
  };
}
