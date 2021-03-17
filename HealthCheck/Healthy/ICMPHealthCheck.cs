using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading;
using System.Threading.Tasks;

namespace HealthCheck.Healthy
{
    public class ICMPHealthCheck : IHealthCheck
    {
        private readonly string Host ;
        private readonly int HealthyRoundtripTime ;

        public ICMPHealthCheck(string host, int healthyRoundtripTime)
        {
            Host = host;
            HealthyRoundtripTime = healthyRoundtripTime;
        }
        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                using var ping = new Ping();
                var reply = await ping.SendPingAsync(Host);

                switch (reply.Status)
                {
                    case IPStatus.Success:
                        var msg = $"ICMP to {Host} took {reply.RoundtripTime} ms.";
                        return (reply.RoundtripTime > HealthyRoundtripTime) ? HealthCheckResult.Degraded(msg) : HealthCheckResult.Healthy(msg);
                    default:
                        return HealthCheckResult.Unhealthy($"ICMP to {Host} failed: {reply.Status}");
                }
            }
            catch (Exception ex)
            {
                var err = $"ICMP to {Host} failed: {ex.Message}";

                return HealthCheckResult.Unhealthy(err);
            }
        }
    }
}
