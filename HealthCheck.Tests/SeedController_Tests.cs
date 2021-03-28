using HealthCheck.Controllers.Seed;
using HealthCheck.Data;
using HealthCheck.Data.Models.Auth;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;


namespace HealthCheck.Tests
{
    class SeedController_Tests
    {
        
        [Fact]
        public async void Test_CreateDefaultUsers()
        {
            //arrange
            var options = new
                 DbContextOptionsBuilder<ApplicationDbContext>()
                 .UseInMemoryDatabase(databaseName: "WorldCities")
                 .Options;

            var storeOptions = Options.Create (new OperationalStoreOptions());

            var mockEnv = new Mock<IWebHostEnvironment>().Object;

            ApplicationUser user_Admin = null;
            ApplicationUser user_User = null;
            ApplicationUser user_NotExisting = null;
            //act
            using (var context = new ApplicationDbContext(options,storeOptions))
            {
                var roleStore = new RoleStore<IdentityRole> (context);

                var roleManager =
                    new RoleManager<IdentityRole>(
                    roleStore,
                    new IRoleValidator<IdentityRole>[0],
                    new UpperInvariantLookupNormalizer(),
                    new Mock<IdentityErrorDescriber>().Object,
                    new Mock<ILogger<RoleManager<IdentityRole>>>().Object

                    
                    );

                var userStore = new UserStore<ApplicationUser>(context);

                var userManager = new UserManager<ApplicationUser>(
                    userStore,
                    new Mock<IOptions<IdentityOptions>>().Object,
                    new Mock<IPasswordHasher<ApplicationUser>>().Object,
                    new IUserValidator<ApplicationUser>[0],
                    new IPasswordValidator<ApplicationUser>[0],
                    new UpperInvariantLookupNormalizer(),
                    new Mock<IdentityErrorDescriber>().Object,
                    new Mock<IServiceProvider>().Object,
                    new Mock<ILogger<UserManager<ApplicationUser>>>().Object);

                var controller = new SeedDataController(
                                context,
                                 mockEnv,
                                roleManager,
                                userManager
                               
                                );

                await controller.CreateDefaultUsers();

                user_Admin = await userManager.FindByEmailAsync("admin@email.com");
                user_User = await userManager.FindByEmailAsync("user@email.com");
                user_NotExisting = await userManager.FindByEmailAsync("notexisting@email.com");


            }



            //assert

            Assert.NotNull(user_Admin);
            Assert.NotNull(user_User);
            Assert.Null(user_NotExisting);
        }
    }
}
