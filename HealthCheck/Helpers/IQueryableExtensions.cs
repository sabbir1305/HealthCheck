using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace HealthCheck.Helpers
{
    public static class IQueryableExtensions
    {
        public static (string,IEnumerable<SqlParameter>) ToParameterizedSql(this IQueryable query)
        {
            string relationalCommandCacheText = "_relationalCommandCache";
            string selectExpressionText = "_selectExpression";
            string querySqlGeneratorFactoryText = "_querySqlGeneratorFactory";
            string relationalQueryContexText = "_relationalQueryContext";

            string cannotGetText = "Can not get";

            var enumerator = query.Provider.Execute<IEnumerable>(query.Expression).GetEnumerator();
            var relationalCommandCache = enumerator.Private(relationalCommandCacheText) as RelationalCommandCache;

            var queryContext = enumerator.Private<RelationalQueryContext>(relationalQueryContexText) ?? throw new InvalidOperationException($"{cannotGetText}{ relationalQueryContexText }");
            var parameterValues = queryContext.ParameterValues;

            string sql;
            IList<SqlParameter> parameters;

            if (relationalCommandCache != null)
            {
#pragma warning disable EF1001 // Internal EF Core API usage.
                var command = relationalCommandCache.GetRelationalCommand(parameterValues);
#pragma warning restore EF1001 // Internal EF Core API usage.

            var    parameterNames = new HashSet<string>(command.Parameters.
Select(p => p.InvariantName));
                sql = command.CommandText;
                parameters = parameterValues.Where(pv => parameterNames.Contains(pv.Key)).Select(pv => new SqlParameter("@" + pv.Key, pv.Value)).
                ToList();
            }
            else
            {
                SelectExpression selectExpression = enumerator.Private<SelectExpression> (selectExpressionText) ?? throw new InvalidOperationException($"{cannotGetText}{ selectExpressionText}");
IQuerySqlGeneratorFactory factory = enumerator.Private<IQuerySqlGeneratorFactory> (querySqlGeneratorFactoryText) ?? throw new InvalidOperationException($"{cannotGetText} {querySqlGeneratorFactoryText}");

            var sqlGenerator = factory.Create();
            var command = sqlGenerator.GetCommand(selectExpression);
            sql = command.CommandText;
            parameters = parameterValues.Select(pv => new SqlParameter("@" +
            pv.Key, pv.Value)).ToList();
        }
return (sql, parameters);
}

        private static readonly BindingFlags bindingFlags = BindingFlags.Instance | BindingFlags.NonPublic;

        private static Object Private(this Object obj, string privateField) 
            => obj.GetType().GetField(privateField, bindingFlags)?.GetValue(obj);

        private static T Private<T>(this Object obj, string privateField) => 
            (T)obj?.GetType().GetField(privateField, bindingFlags)?.GetValue(obj);

    }
}
