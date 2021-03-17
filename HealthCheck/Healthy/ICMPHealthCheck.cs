using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace HealthCheck.Healthy
{
    public class ICMPHealthCheck : IHealthCheck
    {
        private readonly string Host = "www.does-not-exist";
        private readonly int HealthyRoundtripTime = 300;
        public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
