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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    lines.push("---");
    lines.push("");
    lines.push("FULL DOCUMENT TEXT");
    lines.push("");
    lines.push(agreement.fullText);
  }

  lines.push("");
  lines.push("© Global AVC Systems. All rights reserved.");

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${agreement.id}-${agreement.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

const agreements = [
  {
    id: "ffa-001",
    title: "Founding Faculty Participation Agreement",
    type: "faculty",
    status: "active",
    description: "Preserves, codifies, and credentializes the embodied artistic knowledge of Faculty Members into educational modules and digital credentials.",
    lastUpdated: "2024-12-15",
    parties: ["Faculty Member", "Athletes of AlgoRhythm"],
    provisions: [
      { title: "Section 1: Contribution", items: ["Recorded conversations and oral history", "Demonstrations or descriptions of signature sequences", "Name, likeness, and materials for credentialized modules"] },
      { title: "Section 2: Rights & Legacy", items: ["Moral rights retained as source of codified knowledge", 'Credit line: "Codified from the legacy of [Artist Name]"', "Heir/trust designation for royalties in event of death or incapacity"] },
    ],
    fullText: "This Founding Faculty Participation Agreement establishes archival and rights boundaries.",
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
          </div>

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
