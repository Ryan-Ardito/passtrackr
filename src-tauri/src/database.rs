use sqlx::{PgPool, Result};

use crate::SearchPassRes;

pub async fn search_all_passes(pool: &PgPool, search_term: &str) -> Result<Vec<SearchPassRes>> {
    let search_query = format!(
        "
        SELECT 
            p.pass_id,
            p.guest_id,
            g.first_name,
            g.last_name,
            g.town,
            p.remaining_uses,
            p.passtype,
            p.active,
            p.creator,
            p.creation_time
        FROM 
            passes AS p
        JOIN 
            guests AS g ON p.guest_id = g.guest_id
        WHERE 
            LOWER(CONCAT(g.first_name, ' ', g.last_name)) LIKE LOWER('%{search_term}%');
        "
    );

    let passes = sqlx::query_as(&search_query).fetch_all(pool).await?;
    Ok(passes)
}
