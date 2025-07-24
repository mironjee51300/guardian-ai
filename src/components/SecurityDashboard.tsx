import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Phone, 
  MessageSquare, 
  Globe, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThreatStats {
  totalBlocked: number;
  activeThreats: number;
  safeConnections: number;
  inactiveModules: number;
}

interface ProtectionModule {
  id: string;
  name: string;
  icon: any;
  status: 'active' | 'blocked' | 'inactive';
  threatsBlocked: number;
  isEnabled: boolean;
}

const SecurityDashboard = () => {
  const { toast } = useToast();
  const [threatStats, setThreatStats] = useState<ThreatStats>({
    totalBlocked: 1247,
    activeThreats: 3,
    safeConnections: 8924,
    inactiveModules: 1
  });

  const [protectionModules, setProtectionModules] = useState<ProtectionModule[]>([
    {
      id: 'calls',
      name: 'Fraud Call Protection',
      icon: Phone,
      status: 'active',
      threatsBlocked: 423,
      isEnabled: true
    },
    {
      id: 'sms',
      name: 'SMS Fraud Detection',
      icon: MessageSquare,
      status: 'active',
      threatsBlocked: 189,
      isEnabled: true
    },
    {
      id: 'web',
      name: 'Website Security',
      icon: Globe,
      status: 'blocked',
      threatsBlocked: 635,
      isEnabled: true
    },
    {
      id: 'social',
      name: 'Social Media Guard',
      icon: Users,
      status: 'inactive',
      threatsBlocked: 0,
      isEnabled: false
    }
  ]);

  const [realTimeThreats] = useState([
    { type: 'Phishing Call', source: '+1-555-FRAUD', time: '2 mins ago', severity: 'high' },
    { type: 'Malicious Website', source: 'fake-bank.com', time: '5 mins ago', severity: 'critical' },
    { type: 'Spam SMS', source: '+1-888-SCAM', time: '12 mins ago', severity: 'medium' }
  ]);

  const toggleModule = (moduleId: string) => {
    setProtectionModules(prev => 
      prev.map(module => {
        if (module.id === moduleId) {
          const newStatus = module.isEnabled ? 'inactive' : 'active';
          const updatedModule = {
            ...module,
            isEnabled: !module.isEnabled,
            status: newStatus as 'active' | 'inactive'
          };
          
          toast({
            title: `${module.name} ${updatedModule.isEnabled ? 'Activated' : 'Deactivated'}`,
            description: `Protection module is now ${updatedModule.isEnabled ? 'active' : 'inactive'}`,
          });
          
          return updatedModule;
        }
        return module;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-safe text-safe-foreground';
      case 'blocked': return 'bg-threat text-threat-foreground animate-pulse-threat';
      case 'inactive': return 'bg-inactive text-inactive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'blocked': return <XCircle className="w-4 h-4" />;
      case 'inactive': return <EyeOff className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Guardian AI</h1>
            <p className="text-muted-foreground">AI-Powered Fraud Protection</p>
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Threat Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-threat border-threat/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-threat" />
              <div>
                <p className="text-sm text-muted-foreground">Threats Blocked</p>
                <p className="text-2xl font-bold text-threat">{threatStats.totalBlocked}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-warning-bg border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-warning">{threatStats.activeThreats}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-safe border-safe/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-safe" />
              <div>
                <p className="text-sm text-muted-foreground">Safe Connections</p>
                <p className="text-2xl font-bold text-safe">{threatStats.safeConnections}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-inactive-bg border-inactive/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EyeOff className="w-5 h-5 text-inactive" />
              <div>
                <p className="text-sm text-muted-foreground">Inactive Modules</p>
                <p className="text-2xl font-bold text-inactive">{threatStats.inactiveModules}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protection Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Protection Modules</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {protectionModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div key={module.id} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-security">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-card">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{module.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(module.status)}>
                        {getStatusIcon(module.status)}
                        <span className="ml-1 capitalize">{module.status}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {module.threatsBlocked} threats blocked
                      </span>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={module.isEnabled}
                  onCheckedChange={() => toggleModule(module.id)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Real-time Threat Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Real-time Threat Monitor</span>
            <div className="w-2 h-2 bg-safe rounded-full animate-pulse ml-2"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {realTimeThreats.map((threat, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    threat.severity === 'critical' ? 'bg-threat animate-pulse-threat' :
                    threat.severity === 'high' ? 'bg-warning' :
                    'bg-inactive'
                  }`}></div>
                  <div>
                    <p className="font-medium">{threat.type}</p>
                    <p className="text-sm text-muted-foreground">{threat.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={
                    threat.severity === 'critical' ? 'border-threat text-threat' :
                    threat.severity === 'high' ? 'border-warning text-warning' :
                    'border-inactive text-inactive'
                  }>
                    {threat.severity}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{threat.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protection Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Protection Level</span>
            <span className="text-sm text-safe font-semibold">85% Secure</span>
          </div>
          <Progress value={85} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Basic</span>
            <span>Advanced</span>
            <span>Maximum</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;