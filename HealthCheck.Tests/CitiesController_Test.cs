using HealthCheck.Controllers.WorldCity;
using HealthCheck.Data;
using HealthCheck.Data.Models.WorldCities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace HealthCheck.Tests
{
   public class CitiesController_Test
    {
        [Fact]
        public async void GetCiyShouldReturnCity()
        {
            //Arrange
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "WorldCitiesDb").Options;
            using (var context = new ApplicationDbContext(options))
            {
                context.Add(new City()
                {
                    Id = 1,
                    CountryId = 1,
                    Lat = 1,
                    Lon = 1,
                    Name = "Test City"
                });

                context.SaveChanges();
            }

            City city_existing = null;
            City city_notExisting = null;
            //Act

            using (var context = new ApplicationDbContext(options))
            {
                var controller = new CitiesController(context);
                city_existing = (await controller.GetCity(1)).Value;
                city_notExisting  = (await controller.GetCity(10)).Value;
            }

            //Assert

            Assert.NotNull(city_existing);
            Assert.Null(city_notExisting);
        }
    }
}
