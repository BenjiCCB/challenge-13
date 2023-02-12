const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags & their associated products
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tagged_products'}],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one tag by its `id` value (and its associated products)
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tagged_products'}],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new tag (body = "tag_name")
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json({ message: 'New tag created', tagData });
  } catch (err) {
    res.status(400).json(err);
  }
});

// update a tag by its `id` value (body = "tag_name")
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id)

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    if(!req.body.tag_name){
      res.status(404).json({ message: 'Body must contain tag_name field' });
      return;
    }

    Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.status(200).json({message: `Tag ${req.params.id} updated`, tagData});
    } catch (err) {
      res.status(500).json(err);
    } 
});

 // delete a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json({message: `Tag ${req.params.id} deleted`});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
