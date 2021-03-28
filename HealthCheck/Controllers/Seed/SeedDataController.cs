using HealthCheck.Data;
using HealthCheck.Data.Models.Auth;
using HealthCheck.Data.Models.WorldCities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HealthCheck.Controllers.Seed
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;

        public SeedDataController(ApplicationDbContext context,
            IWebHostEnvironment env,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager
            )
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult> Import()
        {
            var path = Path.Combine(_env.ContentRootPath, "Data/Source/worldcities.xlsx");
            using var stream = System.IO.File.OpenRead(path);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var excelPackage = new ExcelPackage(stream);

            var workSheet = excelPackage.Workbook.Worksheets[0];
            var nEndRow = workSheet.Dimension.End.Row;

            var numberOfCountriesAdded = 0;
            var numberOfCitiesAdded = 0;

            var countriesByName = _context.Countries.AsNoTracking().ToDictionary(x => x.Name, StringComparer.OrdinalIgnoreCase);

            for (int nRow = 2; nRow <=nEndRow; nRow++)
            {
                var row = workSheet.Cells[nRow, 1, nRow, workSheet.Dimension.End.Column];
                var countryName = row[nRow, 5].GetValue<string>();
                var iso2 = row[nRow, 6].GetValue<string>();
                var iso3 = row[nRow, 7].GetValue<string>();

                // skip this country if it already exists in the database
                if (countriesByName.ContainsKey(countryName))
                    continue;

                // create the Country entity and fill it with xlsx data
                var country = new Country
                {
                    Name = countryName,
                    ISO2 = iso2,
                    ISO3 = iso3
                };
                // add the new country to the DB context
                await _context.Countries.AddAsync(country);
                // store the country in our lookup to retrieve its Id later on
                countriesByName.Add(countryName, country);
                // increment the counter
                numberOfCountriesAdded++;
            }
            // save all the countries into the Database
            if (numberOfCountriesAdded > 0)
                await _context.SaveChangesAsync();

            var cities = _context.Cities.AsNoTracking().ToDictionary(x => (
            
                Name : x.Name,
                Lat : x.Lat,
                Lon : x.Lon,
                CountryId : x.CountryId
            ));

            for (int nRow = 2; nRow <= nEndRow; nRow++)
            {
                var row = workSheet.Cells[nRow, 1, nRow, workSheet.Dimension.End.Column];

                var name = row[nRow, 1].GetValue<string>();
                var nameAscii = row[nRow, 2].GetValue<string>();
                var lat = row[nRow, 3].GetValue<decimal>();
                var lon = row[nRow, 4].GetValue<decimal>();
                var countryName = row[nRow, 5].GetValue<string>();

                // retrieve country Id by countryName
                var countryId = countriesByName[countryName].Id;

                if (cities.ContainsKey((Name: name, Lat: lat, Lon: lon, CountryId: countryId)))
                    continue;
                // create the City entity and fill it with xlsx data
                var city = new City
                {
                    Name = name,
                    Name_ASCII = nameAscii,
                    Lat = lat,
                    Lon = lon,
                    CountryId = countryId
                };

                // add the new city to the DB context
                _context.Cities.Add(city);
                // increment the counter
                numberOfCitiesAdded++;
            }

            // save all the cities into the Database
            if (numberOfCitiesAdded > 0)
                await _context.SaveChangesAsync();
            return new JsonResult(new
            {
                Cities = numberOfCitiesAdded,
                Countries = numberOfCountriesAdded
            });

        }
   
        [HttpGet]
        public async Task<ActionResult> CreateDefaultUsers()
        {
            throw new NotImplementedException();
        }
    
    }
}
