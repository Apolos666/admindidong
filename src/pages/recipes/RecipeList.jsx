import React, { useState, useEffect } from 'react';
import { recipeService } from '../../services/recipeService';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await recipeService.getAllRecipes();
        setRecipes(data);
      } catch (err) {
        setError('Không thể tải danh sách công thức');
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  if (loading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Danh sách công thức
      </Typography>
      {recipes.map((recipe) => (
        <Paper key={recipe.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{recipe.title}</Typography>
          <Button onClick={() => navigate(`/recipes/${recipe.id}`)}>Xem chi tiết</Button>
        </Paper>
      ))}
    </Box>
  );
};

export default RecipeList; 