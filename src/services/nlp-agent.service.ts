import { NlpAgenticToolCallOutputDto } from '../schemas/output';
import { walletService } from './wallet.service';

class NlpAgentService {
  async processCommand(textCommand: string): Promise<NlpAgenticToolCallOutputDto> {
    const text = textCommand.trim().toLowerCase();
    const contacts = walletService.getContacts();

    // 1. Check Send Money Intent
    if (text.includes('send') || text.includes('transfer') || text.includes('pay person') || text.includes('give')) {
      // Extract amount
      const amountMatch = text.match(/\$?(\d+(\.\d{1,2})?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 50.00;

      // Match contact
      let matchedContact = contacts.find(c => text.includes(c.name.toLowerCase().split(' ')[0]));
      if (!matchedContact) {
        matchedContact = contacts[0]; // default to Sarah Jenkins
      }

      // Extract note if any
      let note = 'Agentic Transfer';
      if (text.includes('for ')) {
        note = text.split('for ')[1].substring(0, 30);
      }

      return {
        intentDetected: 'Send Money to Beneficiary',
        confidenceScore: 0.98,
        toolCallName: 'wallet_send_money',
        toolArguments: {
          recipientName: matchedContact.name,
          recipientAccountNumber: matchedContact.accountNumber,
          amount,
          note,
          pin: '****',
        },
        promptSummary: `Command parsed: Transfer ${amount.toLocaleString()} MMK to ${matchedContact.name} (${matchedContact.bankName}).`,
        executionStatus: 'ready_for_confirmation',
      };
    }

    // 2. Check Top Up Intent
    if (text.includes('top up') || text.includes('topup') || text.includes('add money') || text.includes('deposit')) {
      const amountMatch = text.match(/(\d+(\.\d{1,2})?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 100000;
      let bank = 'KBZ Pay';
      if (text.includes('aya')) bank = 'AYA Bank';
      if (text.includes('cb')) bank = 'CB Bank';
      if (text.includes('wave')) bank = 'Wave Money';

      return {
        intentDetected: 'Top Up Wallet Balance',
        confidenceScore: 0.96,
        toolCallName: 'wallet_top_up',
        toolArguments: {
          sourceBankName: bank,
          amount,
          fundingSourceId: 'src_linked_bank_01',
        },
        promptSummary: `Command parsed: Add ${amount.toLocaleString()} MMK to wallet balance from ${bank}.`,
        executionStatus: 'ready_for_confirmation',
      };
    }

    // 3. Check Pay Bill Intent
    if (text.includes('bill') || text.includes('utility') || text.includes('power') || text.includes('electricity') || text.includes('internet')) {
      const amountMatch = text.match(/(\d+(\.\d{1,2})?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 50000;
      let biller = 'YESC Electricity';
      if (text.includes('internet') || text.includes('wifi')) biller = 'Mytel Fiber';
      if (text.includes('water')) biller = 'YCDC Water Utility';

      return {
        intentDetected: 'Pay Utility Bill',
        confidenceScore: 0.95,
        toolCallName: 'wallet_pay_bill',
        toolArguments: {
          billerName: biller,
          billerId: 'bil_yesc_pwr',
          accountReferenceNumber: 'ACC-889102-YESC',
          amount,
        },
        promptSummary: `Command parsed: Pay ${amount.toLocaleString()} MMK to ${biller}.`,
        executionStatus: 'ready_for_confirmation',
      };
    }

    // 4. Check Lock / Safety Switch Intent
    if (text.includes('lock') || text.includes('freeze') || text.includes('unlock') || text.includes('unfreeze') || text.includes('block card')) {
      const isLocking = text.includes('lock') || text.includes('freeze') || text.includes('block');
      return {
        intentDetected: isLocking ? 'Lock Wallet Security Switch' : 'Unlock Wallet Security Switch',
        confidenceScore: 0.99,
        toolCallName: 'wallet_toggle_lock',
        toolArguments: {
          targetState: isLocking ? 'LOCKED' : 'UNLOCKED',
        },
        promptSummary: `Command parsed: ${isLocking ? 'Lock' : 'Unlock'} all wallet outward transfers immediately.`,
        executionStatus: 'ready_for_confirmation',
      };
    }

    // 5. Default Query / Balance Intent
    const balance = walletService.getBalance();
    return {
      intentDetected: 'Check Account Balance & Analytics',
      confidenceScore: 0.92,
      toolCallName: 'wallet_get_analytics',
      toolArguments: {
        currentBalance: balance.totalBalance,
        remainingDailyLimit: balance.dailyRemainingLimit,
      },
      promptSummary: `Current Balance: ${balance.totalBalance.toLocaleString()} MMK. Remaining Daily Transfer Limit: ${balance.dailyRemainingLimit.toLocaleString()} MMK.`,
      executionStatus: 'auto_executed',
    };
  }

  executeToolCall(toolCall: NlpAgenticToolCallOutputDto): { success: boolean; message: string } {
    try {
      const args = toolCall.toolArguments;
      if (toolCall.toolCallName === 'wallet_send_money') {
        const res = walletService.sendMoney({
          recipientName: args.recipientName,
          recipientAccountNumber: args.recipientAccountNumber,
          amount: args.amount,
          note: args.note,
          pin: '****',
        }, true);
        return { success: true, message: res.message };
      }

      if (toolCall.toolCallName === 'wallet_top_up') {
        const res = walletService.topUp({
          sourceBankName: args.sourceBankName,
          amount: args.amount,
          fundingSourceId: args.fundingSourceId,
        }, true);
        return { success: true, message: res.message };
      }

      if (toolCall.toolCallName === 'wallet_pay_bill') {
        const res = walletService.payBill({
          billerName: args.billerName,
          billerId: args.billerId,
          accountReferenceNumber: args.accountReferenceNumber,
          amount: args.amount,
        }, true);
        return { success: true, message: res.message };
      }

      if (toolCall.toolCallName === 'wallet_toggle_lock') {
        const newState = walletService.toggleWalletLock();
        return {
          success: true,
          message: newState ? 'Wallet card is now LOCKED for security.' : 'Wallet card is now UNLOCKED and active.',
        };
      }

      if (toolCall.toolCallName === 'wallet_get_analytics') {
        return { success: true, message: toolCall.promptSummary };
      }

      return { success: false, message: 'Unknown tool call executed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to execute agentic action.' };
    }
  }
}

export const nlpAgentService = new NlpAgentService();
