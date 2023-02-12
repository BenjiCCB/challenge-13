const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

// find all categories & their associated products
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product}],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one category by its `id` value (and its associated products)
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new category (body = "category_name")
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json({ message: 'New category created', categoryData});
  } catch (err) {
    res.status(400).json(err);
  }
});

// update a category by its `id` value (body = "category_name")
router.put('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id)

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    if(!req.body.category_name){
      res.status(404).json({ message: 'Body must contain category_name field' });
      return;
    }

    Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.status(200).json({message: `Category ${req.params.id} updated`, categoryData});
    } catch (err) {
      res.status(500).json(err);
    } 
});

 // delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json({message: `Category ${req.params.id} deleted`});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
