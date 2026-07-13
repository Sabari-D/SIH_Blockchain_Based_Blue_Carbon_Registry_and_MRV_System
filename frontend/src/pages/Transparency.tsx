import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileJson, Link as LinkIcon, HelpCircle, Code, Cpu } from 'lucide-react';

const Transparency: React.FC = () => {
  const [contractConfig, setContractConfig] = useState<any>({
    BlueCarbonCredit: 'Loading contract...',
    VerifierRegistry: 'Loading contract...',
    CreditMarketplace: 'Loading contract...'
  });

  useEffect(() => {
    // Attempt to load the JSON configuration written by Hardhat
    // @ts-ignore
    import('../contracts.json')
      .then(module => {
        setContractConfig(module.default);
      })
      .catch(() => {
        setContractConfig({
          BlueCarbonCredit: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 (Local Node Host Default)',
          VerifierRegistry: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (Local Node Host Default)',
          CreditMarketplace: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (Local Node Host Default)'
        });
      });
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title" style={{ fontSize: '32px' }}>Registry Transparency & Audit Protocol</h1>
        <p className="page-subtitle">We don't ask you to trust us. We give you the cryptographic keys to check for yourself.</p>
      </div>

      {/* Contract Registry Info */}
      <div className="glass-card" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--primary-cyan)" />
          <span>Deployed Ledger Contracts</span>
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Blue Carbon Credit Token (BCC) (ERC-20)</span>
            <code style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '12px', wordBreak: 'break-all' }}>
              {contractConfig.BlueCarbonCredit}
            </code>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Verifier Registry (Whitelists Approved Scientists)</span>
            <code style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '12px', wordBreak: 'break-all' }}>
              {contractConfig.VerifierRegistry}
            </code>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Credit Marketplace (On-chain Escrow)</span>
            <code style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-glass)', fontSize: '12px', wordBreak: 'break-all' }}>
              {contractConfig.CreditMarketplace}
            </code>
          </div>
        </div>
      </div>

      {/* Audit Guide */}
      <div className="glass-card" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={20} color="var(--secondary-emerald)" />
          <span>Independent Audit Walkthrough</span>
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Every credit on our platform represents 1 ton of CO2 offset backed by satellite observation. Any competitor, buyer, or public auditor can verify claims with these three steps:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '15px', color: '#fff', marginBottom: '6px' }}>Step 1: Fetch Raw Remote Sensing Evidence from IPFS</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Every project details page lists its unique IPFS Content Identifier (CID). This points to an immutable JSON evidence pack pinned to the decentralized IPFS network. Curl or query any gateway to inspect:
            </p>
            <pre style={{ background: '#090d16', padding: '12px', borderRadius: '8px', fontSize: '12px', overflowX: 'auto', border: '1px solid var(--border-glass)' }}>
              curl https://gateway.pinata.cloud/ipfs/QmMockEvidencePackage...
            </pre>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '15px', color: '#fff', marginBottom: '6px' }}>Step 2: Confirm Smart Contract Mint Integrity</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Once you get the IPFS evidence hash, look up the on-chain minting transaction. Check that the `evidenceHash` parameter passed in the smart contract's `mint` event matches the IPFS CID exactly. This guarantees that credits were minted using this specific satellite evidence set, and cannot be minted twice.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, fontSize: '15px', color: '#fff', marginBottom: '6px' }}>Step 3: Validate the Verifier Key</h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Verify that the wallet address signing the verification was an active, authorized member of the `VerifierRegistry` contract at the time of issuance, guaranteeing scientific vetting.
            </p>
          </div>

        </div>
      </div>

      {/* Scientific Formulas */}
      <div className="glass-card">
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--accent-orange)" />
          <span>Scientific MRV Calculations</span>
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
          We map NDVI (Normalized Difference Vegetation Index) from Sentinel-2 satellite aggregate pixels over the polygon area. The calculation translates this data into carbon credits:
        </p>

        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '15px', borderRadius: '10px', fontSize: '13px', borderLeft: '3px solid var(--accent-orange)' }}>
          <div style={{ marginBottom: '6px' }}><strong>1. Organic Biomass Estimation:</strong></div>
          <code style={{ fontSize: '12px', color: '#fff' }}>Biomass (tons) = Average NDVI * Ecosystem Coefficient * Area (Hectares)</code>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Coefficient maps: Mangrove = 280, Seagrass = 60, Salt Marsh = 140</div>
          
          <div style={{ margin: '12px 0 6px 0' }}><strong>2. Carbon Stock Calculation:</strong></div>
          <code style={{ fontSize: '12px', color: '#fff' }}>Carbon Stock (tons C) = Biomass * Ecosystem Carbon Fraction</code>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Carbon fraction maps: Mangrove = 0.45, Seagrass = 0.38, Salt Marsh = 0.40</div>

          <div style={{ margin: '12px 0 6px 0' }}><strong>3. CO2 Offset (Minted BCC):</strong></div>
          <code style={{ fontSize: '12px', color: '#fff' }}>CO2 Offset (tons CO2e) = Carbon Stock * 3.67 (Molecular ratio of CO2 to C)</code>
        </div>
      </div>

    </div>
  );
};

export default Transparency;
