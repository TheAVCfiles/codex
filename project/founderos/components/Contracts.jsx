import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  Download,
  Eye,
  Lock,
  Users,
  Building,
  ArrowLeft,
  FileCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAgreement(agreement) {
  const lines = [
    agreement.title.toUpperCase(),
    "=".repeat(agreement.title.length),
    "",
    `Status: ${agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}`,
    `Last Updated: ${agreement.lastUpdated}`,
    agreement.parties ? `Parties: ${agreement.parties.join(" | ")}` : "",
    "",
    "---",
    "",
    agreement.description,
    "",
  ];

  agreement.provisions.forEach((p) => {
    lines.push(p.title);
    lines.push("-".repeat(p.title.length));
    p.items.forEach((item) => lines.push(`  • ${item}`));
    lines.push("");
  });

  if (agreement.fullText) {
    lines.push("---", "", "FULL DOCUMENT TEXT", "", agreement.fullText);
  }

  lines.push("", "© Global AVC Systems. All rights reserved.");
  downloadTextFile(`${agreement.id}-${agreement.title.replace(/\s+/g, "-").toLowerCase()}.txt`, lines.join("\n"));
}

function downloadTemplate(template) {
  const lines = [
    template.title.toUpperCase(),
    "=".repeat(template.title.length),
    "",
    "Status: Template — Not Executed",
    `Last Updated: ${template.lastUpdated}`,
    "",
    template.description,
    "",
  ];

  template.provisions.forEach((p) => {
    lines.push(p.title);
    lines.push("-".repeat(p.title.length));
    p.items.forEach((item) => lines.push(`  • ${item}`));
    lines.push("");
  });

  if (template.fullText) {
    lines.push("---", "", "TEMPLATE BODY", "", template.fullText);
  }

  lines.push("", "© Global AVC Systems. Template document. Not executed.");
  downloadTextFile(`${template.id}-${template.title.replace(/\s+/g, "-").toLowerCase()}.txt`, lines.join("\n"));
}

const agreements = [
  {
    id: "ffa-001",
    title: "Founding Faculty Participation Agreement",
    type: "faculty",
    status: "active",
    description: "Preserves, codifies, and credentializes the embodied artistic knowledge of Faculty Members into educational modules and digital credentials.",
    lastUpdated: "2024-12-15",
    parties: ["Faculty Member", "[YOUR COMPANY / PLATFORM OPERATOR]"],
    provisions: [
      { title: "Section 1: Contribution", items: ["Recorded conversations and oral history", "Demonstrations or descriptions of signature sequences", "Name, likeness, and materials for credentialized modules"] },
      { title: "Section 2: Rights & Legacy", items: ["Moral rights retained as source of codified knowledge", 'Credit line: "Codified from the legacy of [Artist Name]"', "Heir/trust designation for royalties in event of death or incapacity"] },
    ],
    fullText: "This Founding Faculty Participation Agreement establishes archival and rights boundaries.",
  },
  {
    id: "iga-001",
    title: "Institutional Governance Audit",
    type: "license",
    status: "active",
    description: "Structured governance audit template for institutional readiness assessment.",
    lastUpdated: "2025-01-15",
    parties: ["Institution / Studio", "AVC Governance Architect"],
    provisions: [
      {
        title: "Governance Compression Index",
        items: ["Liability Exposure", "Data Boundary Clarity", "Escalation Controls", "Institutional Readiness", "Regulatory Surface"],
      },
    ],
    fullText: "This audit is an evaluation artifact — not an install.",
  },
];

const templates = [
  {
    id: "gov-001",
    title: "Founder Governance Charter",
    type: "template",
    status: "template",
    description: "Template establishing corridor-based decision rights and safety boundaries.",
    lastUpdated: "2026-02-26",
    provisions: [
      { title: "Purpose", items: ["Corridor-based decision rights (Glissade / Jeté / Fermata / Coda)"] },
      { title: "Safety Boundary", items: ["No material action without DSI ≥12 and Drift check"] },
    ],
    fullText: "FOUNDER GOVERNANCE CHARTER v1\nEntity: [Company Name] | Date: [YYYY-MM-DD]",
  },
  {
    id: "gov-002",
    title: "IP & Contribution Assignment",
    type: "template",
    status: "template",
    description: "Template for irrevocable assignment of contributions with ledger proof.",
    lastUpdated: "2026-02-26",
    provisions: [
      { title: "Assignment", items: ["All code, choreography, somatic models, and data assigned to entity"] },
      { title: "Revocation", items: ["Revocation path only via Fermata corridor"] },
    ],
    fullText: "IP & CONTRIBUTION ASSIGNMENT AGREEMENT\nKinetic Ledger proof required for every artifact.",
  },
  {
    id: "gov-003",
    title: "Role & Responsibility Matrix",
    type: "template",
    status: "template",
    description: "Template for Bayesian-weighted governance roles and weekly updates.",
    lastUpdated: "2026-02-26",
    provisions: [
      { title: "Roles", items: ["Founder: 40%", "Governance Lead: 30%", "Contributors: posterior-weighted scoring"] },
    ],
    fullText: "ROLE & RESPONSIBILITY MATRIX\nUpdate cadence: weekly via Sandbox.",
  },
  {
    id: "gov-004",
    title: "Data & Safety Protocol",
    type: "template",
    status: "template",
    description: "Template for data minimization, parent consent, and artifact notarization.",
    lastUpdated: "2026-02-26",
    provisions: [
      { title: "Data Rules", items: ["No full minor names in public views", "StagePort portable records with explicit parent consent", "All artifacts hashed and notarized"] },
    ],
    fullText: "D3S DATA & SAFETY PROTOCOL\nHash: [SHA-256]",
  },
  {
    id: "gov-005",
    title: "Capital Readiness & Registry Consent",
    type: "template",
    status: "template",
    description: "Template for registry consent and Capital Unlock Memo readiness.",
    lastUpdated: "2026-02-26",
    provisions: [
      { title: "Consent", items: ["Consent to list in AVC Certification Registry", "1-year renewable", "Produces Capital Unlock Memo upon Tier I+"] },
    ],
    fullText: "CAPITAL READINESS & REGISTRY CONSENT\nHash: [SHA-256]",
  },
];

const typeIcons = { faculty: Users, pilot: Building, investor: Shield, license: Lock, template: FileCheck };
const typeLabels = { faculty: "Faculty Agreement", pilot: "Pilot Agreement", investor: "Investor Addendum", license: "License", template: "Template" };
const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  draft: "bg-muted text-muted-foreground border-border",
  template: "bg-blue-500/15 text-blue-300 border-blue-500/30",
};

export default function Contracts() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [viewingFullText, setViewingFullText] = useState(null);
  const [activeTab, setActiveTab] = useState("agreements");

  const docs = activeTab === "agreements" ? agreements : templates;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/">
              <a>
                <Button variant="ghost" size="sm" className="gap-2" data-testid="link-back-home">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-xs tracking-[0.15em] font-light">STAGEPORT SYSTEMS</span>
                </Button>
              </a>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="text-xs tracking-[0.2em] text-primary font-medium" data-testid="text-contracts-label">AGREEMENT LIBRARY</span>
            <h1 className="text-4xl md:text-5xl font-light mt-4 mb-4" data-testid="text-contracts-headline">Contract Management</h1>
            <div className="flex gap-2" data-testid="contracts-view-toggle">
              <Button variant={activeTab === "agreements" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("agreements")}>Executed / Issuable</Button>
              <Button variant={activeTab === "templates" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("templates")}>Templates (Not Executed)</Button>
            </div>
          </div>

          <div className="grid gap-4">
            {docs.map((doc, index) => {
              const TypeIcon = typeIcons[doc.type];
              return (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <Card className="hover-elevate cursor-pointer transition-all duration-200" onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)} data-testid={`card-agreement-${doc.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 rounded-lg bg-muted"><TypeIcon className="w-5 h-5 text-muted-foreground" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-medium" data-testid={`text-agreement-title-${doc.id}`}>{doc.title}</h3>
                              <Badge variant="outline" className={statusColors[doc.status]}>
                                {doc.status === "active" && <Check className="w-3 h-3 mr-1" />}
                                {doc.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                {doc.status === "draft" && <AlertCircle className="w-3 h-3 mr-1" />}
                                {doc.status === "template" && <FileCheck className="w-3 h-3 mr-1" />}
                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-light line-clamp-2">{doc.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span>{typeLabels[doc.type]}</span>
                              <span>Updated {doc.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedDoc?.id === doc.id ? "rotate-90" : ""}`} />
                      </div>

                      {selectedDoc?.id === doc.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border">
                          <div className="space-y-4">
                            {doc.provisions.map((provision, provIndex) => (
                              <div key={provIndex}>
                                <h4 className="text-sm font-medium mb-2">{provision.title}</h4>
                                <ul className="space-y-1.5 text-sm text-muted-foreground font-light">
                                  {provision.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-2">
                                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3 mt-6 flex-wrap">
                            <Button size="sm" variant="outline" className="gap-2" data-testid={`button-view-${doc.id}`} onClick={(e) => {
                              e.stopPropagation();
                              setViewingFullText(viewingFullText === doc.id ? null : doc.id);
                            }}>
                              <Eye className="w-4 h-4" />
                              {viewingFullText === doc.id ? "Hide Document" : "View Document"}
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2" data-testid={`button-download-${doc.id}`} onClick={(e) => {
                              e.stopPropagation();
                              if (doc.status === "template") {
                                downloadTemplate(doc);
                              } else {
                                downloadAgreement(doc);
                              }
                            }}>
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>

                          {viewingFullText === doc.id && doc.fullText && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border">
                              <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                                <h4 className="text-xs tracking-[0.15em] text-primary font-medium uppercase mb-4">{doc.status === "template" ? "Template Text" : "Full Document Text"}</h4>
                                <div className="text-sm text-muted-foreground font-light leading-relaxed whitespace-pre-line">{doc.fullText}</div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <Card className="mt-12 border-dashed" data-testid="card-notarization-cta">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Need Document Notarization?</h3>
              <Link href="/governance">
                <a>
                  <Button className="gap-2" data-testid="button-goto-governance">
                    Open Governance Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </a>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
