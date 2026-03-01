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

function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: "text/plain" });
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

  downloadTextFile(
    `${agreement.id}-${agreement.title.replace(/\s+/g, "-").toLowerCase()}.txt`,
    lines.join("\n")
  );
}

function downloadTemplate(template) {
  const lines = [
    template.title.toUpperCase(),
    "=".repeat(template.title.length),
    "",
    "STATUS: TEMPLATE — NOT EXECUTED",
    `Last Updated: ${template.lastUpdated}`,
    "",
    "IMPORTANT",
    "---------",
    "This is a template artifact. It is not binding until completed, reviewed, and signed.",
    "",
    template.description,
    "",
    "INTENDED USE",
    "------------",
    ...template.intendedUse.map((item) => `  • ${item}`),
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

  lines.push("", "© Global AVC Systems. Template artifact. Not executed.");

  downloadTextFile(
    `${template.id}-${template.title.replace(/\s+/g, "-").toLowerCase()}.txt`,
    lines.join("\n")
  );
}

const agreements = [
  {
    id: "ffa-001",
    title: "Founding Faculty Participation Agreement",
    type: "faculty",
    status: "active",
    description:
      "Preserves, codifies, and credentializes embodied artistic knowledge into educational modules and digital credentials.",
    lastUpdated: "2024-12-15",
    parties: ["Faculty Member", "[YOUR COMPANY / PLATFORM OPERATOR]"],
    provisions: [
      {
        title: "Section 1: Contribution",
        items: [
          "Recorded conversations and oral history",
          "Demonstrations or descriptions of signature sequences",
          "Name, likeness, and materials for credentialized modules",
        ],
      },
      {
        title: "Section 2: Rights & Legacy",
        items: [
          "Moral rights retained as source of codified knowledge",
          'Credit line: "Codified from the legacy of [Artist Name]"',
          "Heir/trust designation for royalties in event of death or incapacity",
        ],
      },
    ],
    fullText:
      "This Founding Faculty Participation Agreement establishes archival and rights boundaries.",
  },
  {
    id: "sfa-001",
    title: "Founding Faculty Addendum",
    type: "investor",
    status: "active",
    description:
      "Defines faculty role, rights, and boundaries while separating personal creative works from system architecture.",
    lastUpdated: "2024-12-10",
    parties: ["Faculty Member", "[YOUR COMPANY]"],
    provisions: [
      {
        title: "Faculty Rights",
        items: [
          "Faculty retain ownership of personal creative works",
          "Original choreography remains Faculty intellectual property",
        ],
      },
      {
        title: "System Ownership",
        items: [
          "[YOUR COMPANY] retains all system logic and credentialing",
          "Scoring logic, governance weighting, and token logic are protected as exclusive IP",
        ],
      },
    ],
    fullText: "This addendum defines legal and operational boundaries for collaborative deployment.",
  },
  {
    id: "l1p-001",
    title: "Level I Pilot License",
    type: "license",
    status: "pending",
    description:
      "Limited, revocable license for local installation with non-exclusive, non-transferable, outcome-only access.",
    lastUpdated: "2024-12-08",
    parties: ["Operator", "[YOUR COMPANY]"],
    provisions: [
      {
        title: "License Terms",
        items: [
          "Limited, revocable license for local installation",
          "Non-exclusive and non-transferable rights",
          "Outcome-only access with no system internals",
        ],
      },
      {
        title: "Revocation",
        items: [
          "Immediate revocation on confidentiality breach",
          "Immediate revocation on attempted reverse engineering",
        ],
      },
    ],
    fullText: "Level I Pilot License Agreement grants the operator narrow and revocable access rights.",
  },
  {
    id: "ffb-001",
    title: "Founding Faculty Briefing Memo",
    type: "faculty",
    status: "draft",
    description:
      "Defines role, rights, limits, and protections for Founding Faculty in a Level I pilot.",
    lastUpdated: "2024-12-05",
    parties: ["Founding Faculty", "[YOUR COMPANY]"],
    provisions: [
      {
        title: "Role Definition",
        items: [
          "Founding Faculty serve as embodied knowledge source",
          "Participation is collaborative and archival",
        ],
      },
      {
        title: "Consent Vow",
        items: [
          "We agree to teach with constraint",
          "We agree to govern with clarity",
          "We agree to protect embodied labor",
        ],
      },
    ],
    fullText: "Founding Faculty Briefing Memo captures operating posture for pilot-phase collaboration.",
  },
  {
    id: "iga-001",
    title: "Institutional Governance Audit",
    type: "license",
    status: "active",
    description:
      "Structured governance readiness assessment across boundary clarity, data exposure, infrastructure posture, and regulatory surface.",
    lastUpdated: "2025-01-15",
    parties: ["Institution / Studio", "AVC Governance Architect"],
    provisions: [
      {
        title: "Structural Risk Review",
        items: [
          "Boundary clarity assessment",
          "Data exposure mapping",
          "Infrastructure posture evaluation",
          "Escalation control verification",
        ],
      },
      {
        title: "Governance Compression Index (1-5)",
        items: [
          "Liability Exposure",
          "Data Boundary Clarity",
          "Escalation Controls",
          "Institutional Readiness",
          "Regulatory Surface",
        ],
      },
    ],
    fullText: "This audit provides a scored governance evaluation and recommendation artifact.",
  },
];

const templates = [
  {
    id: "tmpl-001",
    title: "Founder Governance Charter",
    status: "template",
    description:
      "Establishes corridor-based decision rights, governance accountability, and safety boundaries.",
    lastUpdated: "2026-02-26",
    intendedUse: [
      "Fill for each founder deployment",
      "Hash and notarize in FounderOS Sandbox",
      "Archive as ledger-backed governance artifact",
    ],
    provisions: [
      { title: "Purpose", items: ["Glissade / Jeté / Fermata / Coda corridors", "Governance lead and vote weighting"] },
      { title: "Safety Boundary", items: ["No material action without DSI threshold and drift check"] },
    ],
    fullText: "FOUNDER GOVERNANCE CHARTER v1\nEntity: [CLIENT_NAME] | Date: [YYYY-MM-DD]",
  },
  {
    id: "tmpl-002",
    title: "IP & Contribution Assignment",
    status: "template",
    description: "Irrevocable assignment template for contributions, with audit-ready ledger proof requirements.",
    lastUpdated: "2026-02-26",
    intendedUse: ["Assign code/content rights", "Define revocation pathway", "Preserve proof-of-origin trail"],
    provisions: [
      { title: "Assignment", items: ["All contributions assigned to entity", "Kinetic Ledger proof required for each artifact"] },
      { title: "Revocation", items: ["Revocation route via Fermata corridor only"] },
    ],
    fullText: "IP & CONTRIBUTION ASSIGNMENT AGREEMENT\nEntity: [CLIENT_NAME]",
  },
  {
    id: "tmpl-003",
    title: "Role & Responsibility Matrix",
    status: "template",
    description: "Defines weighted responsibilities and weekly governance update cadence.",
    lastUpdated: "2026-02-26",
    intendedUse: ["Set weighted decision model", "Define ownership by role", "Review weekly in Sandbox"],
    provisions: [
      { title: "Core Weights", items: ["Founder: 40%", "Governance Lead: 30%", "Contributors: Bayesian posterior"] },
    ],
    fullText: "ROLE & RESPONSIBILITY MATRIX\nWeekly review cadence: FounderOS Sandbox",
  },
  {
    id: "tmpl-004",
    title: "Data & Safety Protocol",
    status: "template",
    description: "Data minimization and consent-first policy template for institutional readiness.",
    lastUpdated: "2026-02-26",
    intendedUse: ["Define protected data boundaries", "Enforce consent requirements", "Anchor records to ledger"],
    provisions: [
      { title: "Data Rules", items: ["No full minor names in public views", "Explicit parent/guardian consent"] },
      { title: "Record Integrity", items: ["All artifacts hashed and notarized"] },
    ],
    fullText: "DATA & SAFETY PROTOCOL\nPolicy owner: [CLIENT_NAME]",
  },
  {
    id: "tmpl-005",
    title: "Capital Readiness & Registry Consent",
    status: "template",
    description: "Consent template for registry listing and capital readiness signaling.",
    lastUpdated: "2026-02-26",
    intendedUse: ["Capture registry consent", "Support institutional visibility", "Trigger Capital Unlock Memo workflow"],
    provisions: [
      { title: "Consent", items: ["1-year renewable registry listing", "Tier I+ readiness memo output"] },
    ],
    fullText: "CAPITAL READINESS & REGISTRY CONSENT\nRegistry: [PROGRAM_NAME]",
  },
];

const typeIcons = { faculty: Users, pilot: Building, investor: Shield, license: Lock };
const typeLabels = { faculty: "Faculty Agreement", pilot: "Pilot Agreement", investor: "Investor Addendum", license: "License" };
const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  draft: "bg-muted text-muted-foreground border-border",
};

export default function Contracts() {
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [viewingFullText, setViewingFullText] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

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
            <div className="hidden md:flex items-center gap-6">
              <Link href="/governance"><a className="text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors font-light" data-testid="link-governance">GOVERNANCE</a></Link>
              <Link href="/faculty-onboarding"><a className="text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors font-light" data-testid="link-faculty">FACULTY</a></Link>
              <Link href="/token-economy"><a className="text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors font-light" data-testid="link-tokens">TOKENS</a></Link>
              <Link href="/research"><a className="text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors font-light" data-testid="link-research">R&D</a></Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="text-xs tracking-[0.2em] text-primary font-medium" data-testid="text-contracts-label">AGREEMENT LIBRARY</span>
            <h1 className="text-4xl md:text-5xl font-light mt-4 mb-6" data-testid="text-contracts-headline">Contract Management</h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl">
              Executed and issuable legal artifacts live here. Operational templates are separated so legal posture stays clear.
            </p>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <Button
              size="sm"
              variant={showTemplates ? "outline" : "default"}
              onClick={() => setShowTemplates(false)}
              data-testid="button-show-agreements"
            >
              Agreement Library
            </Button>
            <Button
              size="sm"
              variant={showTemplates ? "default" : "outline"}
              onClick={() => setShowTemplates(true)}
              className="gap-2"
              data-testid="button-show-templates"
            >
              <FileCheck className="w-4 h-4" />
              Templates (Not Executed)
            </Button>
          </div>

          {!showTemplates && (
            <div className="grid gap-4">
              {agreements.map((agreement, index) => {
                const TypeIcon = typeIcons[agreement.type];
                return (
                  <motion.div key={agreement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                    <Card className="hover-elevate cursor-pointer transition-all duration-200" onClick={() => setSelectedAgreement(selectedAgreement?.id === agreement.id ? null : agreement)} data-testid={`card-agreement-${agreement.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-2 rounded-lg bg-muted"><TypeIcon className="w-5 h-5 text-muted-foreground" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="font-medium" data-testid={`text-agreement-title-${agreement.id}`}>{agreement.title}</h3>
                                <Badge variant="outline" className={statusColors[agreement.status]}>
                                  {agreement.status === "active" && <Check className="w-3 h-3 mr-1" />}
                                  {agreement.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                  {agreement.status === "draft" && <AlertCircle className="w-3 h-3 mr-1" />}
                                  {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground font-light line-clamp-2">{agreement.description}</p>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span>{typeLabels[agreement.type]}</span>
                                <span>Updated {agreement.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedAgreement?.id === agreement.id ? "rotate-90" : ""}`} />
                        </div>

                        {selectedAgreement?.id === agreement.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border">
                            <div className="space-y-4">
                              {agreement.provisions.map((provision, provIndex) => (
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
                              <Button size="sm" variant="outline" className="gap-2" data-testid={`button-view-${agreement.id}`} onClick={(e) => {
                                e.stopPropagation();
                                setViewingFullText(viewingFullText === agreement.id ? null : agreement.id);
                              }}>
                                <Eye className="w-4 h-4" />
                                {viewingFullText === agreement.id ? "Hide Document" : "View Document"}
                              </Button>
                              <Button size="sm" variant="outline" className="gap-2" data-testid={`button-download-${agreement.id}`} onClick={(e) => {
                                e.stopPropagation();
                                downloadAgreement(agreement);
                              }}>
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                            </div>

                            {viewingFullText === agreement.id && agreement.fullText && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border">
                                <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                                  <h4 className="text-xs tracking-[0.15em] text-primary font-medium uppercase mb-4">Full Document Text</h4>
                                  <div className="text-sm text-muted-foreground font-light leading-relaxed whitespace-pre-line">{agreement.fullText}</div>
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
          )}

          {showTemplates && (
            <div className="grid gap-4">
              {templates.map((template, index) => (
                <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                  <Card className="hover-elevate cursor-pointer transition-all duration-200" onClick={() => setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)} data-testid={`card-template-${template.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 rounded-lg bg-muted"><FileCheck className="w-5 h-5 text-muted-foreground" /></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-medium" data-testid={`text-template-title-${template.id}`}>{template.title}</h3>
                              <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Template — Not Executed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-light line-clamp-2">{template.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <span>Template Artifact</span>
                              <span>Updated {template.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${selectedTemplate?.id === template.id ? "rotate-90" : ""}`} />
                      </div>

                      {selectedTemplate?.id === template.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6 pt-6 border-t border-border">
                          <div className="space-y-4">
                            {template.provisions.map((provision, provIndex) => (
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
                            <Button size="sm" variant="outline" className="gap-2" data-testid={`button-download-template-${template.id}`} onClick={(e) => {
                              e.stopPropagation();
                              downloadTemplate(template);
                            }}>
                              <Download className="w-4 h-4" />
                              Download Template
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

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
