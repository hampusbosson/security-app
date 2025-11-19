import { FindingsTable } from "@/components/dashboard/FindingsTable";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FindingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Findings</h1>
        <p className="text-muted-foreground mt-1">All detected vulnerabilities across your repositories</p>
      </div>

      <div className="flex items-center gap-3">
        <Badge className="bg-destructive/10 text-destructive border-destructive/30">
          3 Critical
        </Badge>
        <Badge className="bg-warning/10 text-warning border-warning/30">
          5 High
        </Badge>
        <Badge className="bg-info/10 text-info border-info/30">
          12 Medium
        </Badge>
        <Badge className="bg-muted text-muted-foreground">
          8 Low
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="all">All Findings</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="fix-ready">Fix Ready</TabsTrigger>
          <TabsTrigger value="validated">Validated</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <FindingsTable />
        </TabsContent>
        <TabsContent value="critical" className="mt-6">
          <FindingsTable />
        </TabsContent>
        <TabsContent value="fix-ready" className="mt-6">
          <FindingsTable />
        </TabsContent>
        <TabsContent value="validated" className="mt-6">
          <FindingsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FindingsPage;