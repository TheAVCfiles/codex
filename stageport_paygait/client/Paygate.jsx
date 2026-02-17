import React, { useState } from 'react';
import { ethers } from 'ethers';

export default function Paygate({ user }) {
  const [amountCents, setAmountCents] = useState(5000);
  const [loading, setLoading] = useState(false);

  async function getNonce(wallet) {
    const response = await fetch(`/api/nonce/${wallet}`);
    const json = await response.json();
    return json.nonce;
  }

  async function signBridge(wallet, cents, nonce, expiry = Math.floor(Date.now() / 1000) + 300, paygateId = '') {
    const domain = {
      name: 'StagePort Bridge',
      version: '1',
      chainId: 8453,
      verifyingContract: process.env.REACT_APP_STAGECOIN_ADDRESS,
    };

    const types = {
      Bridge: [
        { name: 'user', type: 'address' },
        { name: 'amountCents', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'expiry', type: 'uint256' },
        { name: 'paygateId', type: 'string' },
      ],
    };

    const message = {
      user: wallet,
      amountCents: cents.toString(),
      nonce,
      expiry,
      paygateId,
    };

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer._signTypedData(domain, types, message);

    return { signature, expiry };
  }

  async function convert() {
    try {
      setLoading(true);

      const wallet = user.wallet;
      const nonce = await getNonce(wallet);
      const { signature, expiry } = await signBridge(wallet, amountCents, nonce);

      const payload = {
        userAddress: wallet,
        amountCents,
        nonce,
        expiry,
        signature,
      };

      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        alert(`Converted! Tx: ${result.txHash}`);
      } else {
        alert(`Error: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl">
      <h3 className="font-bold">Convert Studio Credits → Stagecoin</h3>
      <p className="text-sm text-gray-600">Amount (cents):</p>
      <input
        type="number"
        value={amountCents}
        onChange={(e) => setAmountCents(parseInt(e.target.value, 10))}
      />
      <button
        onClick={convert}
        disabled={loading}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Processing...' : 'Convert'}
      </button>
      <p className="mt-3 text-xs text-gray-500">You will be asked to sign a short consent (no gas).</p>
    </div>
  );
}
