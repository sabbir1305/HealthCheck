using HealthCheck.Data.Models.Auth;
using HealthCheck.Data.Models.WorldCities;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HealthCheck.Data
{
    public class ApplicationDbContext :  ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalOptions) : base(options,operationalOptions)
        {

        }
      
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
    }
}
