﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace HealthCheck.Data.Dtos
{
    public class CountryDTO
    {
        public CountryDTO() { }
        #region Properties
        public int Id { get; set; }
        public string Name { get; set; }
        [JsonPropertyName("iso2")]
        public string ISO2 { get; set; }
        [JsonPropertyName("iso3")]
        public string ISO3 { get; set; }
        public int TotalCities { get; set; }
        #endregion

    }
}
